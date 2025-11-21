import { useState, useRef } from 'react'
import Scene3D from './components/3D/Scene3D'
import CustomizationPanel from './components/CustomizationPanel'
import PartCustomizationPopup from './components/PartCustomizationPopup'
import SubmitButton from './components/SubmitButton'
import Toast from './components/Toast'
import InfoPopup from './components/InfoPopup'
import { useResponsive } from './hooks/useResponsive'
import './App.css'

function App({ onSubmit }) {
  const scene3DRef = useRef();
  const { isMobile } = useResponsive();
  const [modelId, setModelId] = useState('1'); // New state for model selection
  const [stitchColor, setStitchColor] = useState('#ffffff');
  const [fabricColor, setFabricColor] = useState('#dfdfdf'); // Default grey color (6-char hex)
  const [fabricType, setFabricType] = useState('leather');
  const [patternId, setPatternId] = useState('default'); // New state for pattern selection
  const [seatType, setSeatType] = useState('single'); // 'single' or 'two-tone'
  const [meshCustomizations, setMeshCustomizations] = useState({});
  const [savedTwoToneCustomizations, setSavedTwoToneCustomizations] = useState({});
  const [showIndividualControls, setShowIndividualControls] = useState(false);
  const [highlightedMesh, setHighlightedMesh] = useState(null);
  const [popupState, setPopupState] = useState(null); // { partName, position }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]); // Array of { id, message, type }
  const [glowEditableParts, setGlowEditableParts] = useState(false); // Trigger glow effect for 2 seconds
  const [twoToneColor, setTwoToneColor] = useState('#dfdfdf'); // Selected color for two-tone application
  const [twoTonePattern, setTwoTonePattern] = useState('default'); // Selected pattern for two-tone application
  const [partClickStates, setPartClickStates] = useState({}); // Track click state for each part: 0=default, 1=color only, 2=color+pattern, 3=back to base
  const [showInfoPopup, setShowInfoPopup] = useState(false); // Show info popup

  const handleMeshCustomizationChange = (meshName, customization) => {
    setMeshCustomizations(prev => ({
      ...prev,
      [meshName]: customization
    }));
  };
  
  // Format part name for display in toasts
  const formatPartName = (partName) => {
    return partName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const handleMeshHighlight = (meshName) => {
    setHighlightedMesh(meshName);
  };

  // Seat type change handler that preserves/restores two-tone edits
  const handleSeatTypeChange = (nextType) => {
    if (nextType === 'single') {
      // Clear two-tone customizations when switching to single tone (do not persist)
      setMeshCustomizations({});
      setSavedTwoToneCustomizations({});
      setPartClickStates({}); // Clear click states
      setSeatType('single');
      setPopupState(null); // Close any open popup
    } else if (nextType === 'two-tone') {
      // Start fresh in two-tone mode (do not restore old customizations)
      setMeshCustomizations({});
      setPartClickStates({}); // Clear click states
      setSeatType('two-tone');
      
      // Show the two-tone customization popup automatically
      setPopupState({ 
        partName: 'two-tone-selector',
        position: { x: window.innerWidth * 0.4, y: 150 } // Position it in the 3D view area
      });
    }
  };

  const handleMeshUnhighlight = () => {
    setHighlightedMesh(null);
  };

  const handlePartRightClick = (partName, position, isValid) => {
    if (seatType !== 'two-tone') return;

    if (isValid && partName) {
      // Define combo parts that sync left-right
      const comboPairs = {
        'seat_back_lower_Left': 'seat_back_lower_Right',
        'seat_back_lower_Right': 'seat_back_lower_Left',
        'seat_bottom_lower_Left': 'seat_bottom_lower_Right',
        'seat_bottom_lower_Right': 'seat_bottom_lower_Left',
        'left_arm_upper': 'right_arm_upper',
        'right_arm_upper': 'left_arm_upper'
      };
      
      // Get the paired part if this is a combo part
      const pairedPart = comboPairs[partName];
      
      // Get current click state for this part (0 = not customized, 1 = color only, 2 = color+pattern, 3 = removed)
      const currentState = partClickStates[partName] || 0;
      let nextState;
      let customization;
      let toastMessage;
      
      if (currentState === 0) {
        // First click: Apply color only (no pattern/stitching)
        nextState = 1;
        customization = {
          fabricColor: twoToneColor,
          patternId: 'default' // No pattern
        };
        toastMessage = `✓ Custom color applied to ${formatPartName(partName)}`;
      } else if (currentState === 1) {
        // Second click: Add pattern and stitching
        nextState = 2;
        customization = {
          fabricColor: twoToneColor,
          patternId: twoTonePattern
        };
        toastMessage = `✓ Pattern & stitching applied to ${formatPartName(partName)}`;
      } else if (currentState === 2) {
        // Third click: Back to color only (remove pattern/stitching)
        nextState = 3;
        customization = {
          fabricColor: twoToneColor,
          patternId: 'default'
        };
        toastMessage = `✓ Pattern removed from ${formatPartName(partName)}`;
      } else {
        // Fourth click: Reset to base color (remove customization entirely)
        nextState = 0;
        customization = null; // Remove customization completely
        toastMessage = `✓ ${formatPartName(partName)} reset to base color`;
      }
      
      // Update part click state for both the clicked part and its pair (if combo)
      setPartClickStates(prev => {
        const updated = {
          ...prev,
          [partName]: nextState
        };
        // If this is a combo part, sync the paired part
        if (pairedPart) {
          updated[pairedPart] = nextState;
        }
        return updated;
      });
      
      // If customization is null, remove it from meshCustomizations
      if (customization === null) {
        setMeshCustomizations(prev => {
          const updated = { ...prev };
          delete updated[partName];
          // If this is a combo part, also remove the paired part
          if (pairedPart) {
            delete updated[pairedPart];
          }
          return updated;
        });
      } else {
        // Apply customization to the clicked part
        handleMeshCustomizationChange(partName, customization);
        // If this is a combo part, also apply to the paired part
        if (pairedPart) {
          handleMeshCustomizationChange(pairedPart, customization);
        }
      }
      
      // Add toast to queue
      const toastId = Date.now() + Math.random();
      setToasts(prev => [...prev, { id: toastId, message: toastMessage, type: 'success' }]);
      
      // Remove toast after 3 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }, 3000);
    } else {
      // Invalid part clicked - show warning and glow effect
      const toastId = Date.now() + Math.random();
      setToasts(prev => [...prev, { id: toastId, message: 'Please select a valid area', type: 'error' }]);
      setGlowEditableParts(true);
      
      // Clear toast and glow effect after 2-3 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }, 3000);
      setTimeout(() => setGlowEditableParts(false), 2000);
    }
  };

  const handlePopupClose = () => {
    // Close popup immediately - no state changes needed on backdrop click
    setPopupState(null);
  };

  const handlePopupApply = (customization) => {
    if (popupState) {
      console.log(`🎯 Applying customization to ${popupState.partName}:`, customization);
      // Apply customization first, then close popup after state update
      handleMeshCustomizationChange(popupState.partName, customization);
      // Don't close popup here - let PartCustomizationPopup handle it since it applies changes immediately
    }
  };

  const handleResetModel = () => {
    console.log('🔄 Resetting model to default settings');
    setModelId('1');
    setFabricType('leather');
    setFabricColor('#dfdfdf'); // Default grey
    setStitchColor('#ffffff');
    setPatternId('default');
    setMeshCustomizations({});
    setSavedTwoToneCustomizations({});
    setPartClickStates({}); // Clear click states
    setShowIndividualControls(false);
    setHighlightedMesh(null);
    setTwoToneColor('#dfdfdf');
    setTwoTonePattern('default');
    
    // If in two-tone mode, reset to single tone first, then show popup
    if (seatType === 'two-tone') {
      setSeatType('single');
      // Use setTimeout to ensure state updates before showing popup
      setTimeout(() => {
        setSeatType('two-tone');
        setPopupState({ 
          partName: 'two-tone-selector',
          position: { x: window.innerWidth * 0.4, y: 150 }
        });
      }, 100);
    } else {
      setSeatType('single');
    }
    
    console.log('✅ Model reset to defaults');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('📸 Starting image capture...');
      
      // Capture images from different angles
      const images = await scene3DRef.current.captureImages();
      
      // Generate unique ID
      const uniqueId = `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`✅ Captured ${images.length} images with ID: ${uniqueId}`);
      
      // Prepare configuration data
      const configData = {
        // Metadata
        id: uniqueId,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        
        // Model info
        modelId,
        
        // Global settings (single-tone mode)
        global: {
          fabricType,
          fabricColor,
          stitchColor,
          patternId,
          seatType
        },
        
        // Individual part customizations (two-tone mode)
        parts: Object.entries(meshCustomizations).map(([partName, customization]) => ({
          partName,
          fabricColor: customization.fabricColor,
          fabricType: customization.fabricType,
          stitchColor: customization.stitchColor,
          patternId: customization.patternId,
          clickState: partClickStates[partName] || 0
        })),
        
        // Raw mesh customizations object (for backward compatibility)
        meshCustomizations,
        
        // Part click states
        partClickStates,
        
        // Editable parts list (for reference)
        editableParts: [
          'seat_bottom_upper',
          'seat_bottom_lower',
          'seat_bottom_lower_Left',
          'seat_bottom_lower_Right',
          'seat_back_upper',
          'seat_back_lower',
          'seat_back_lower_Left',
          'seat_back_lower_Right',
          'headset_front',
          'headset_back',
          'left_arm_upper',
          'right_arm_upper'
        ]
      };
      
      // Prepare images data
      const imagesData = images.map(img => ({
        angle: img.angle,
        dataUrl: img.dataUrl,
        blob: img.blob || null // Include blob if available
      }));
      
      // Call the callback function with images and config
      if (onSubmit && typeof onSubmit === 'function') {
        console.log('📤 Calling onSubmit callback...');
        await onSubmit({
          images: imagesData,
          config: configData
        });
        console.log('✅ onSubmit callback completed');
      } else {
        // Fallback: download files if no callback provided
        console.warn('⚠️ No onSubmit callback provided, downloading files locally');
        
        images.forEach((img) => {
          const link = document.createElement('a');
          link.download = `${uniqueId}_${img.angle}.png`;
          link.href = img.dataUrl;
          link.click();
        });
        
        const configBlob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
        const configLink = document.createElement('a');
        configLink.download = `${uniqueId}_config.json`;
        configLink.href = URL.createObjectURL(configBlob);
        configLink.click();
        
        alert(`Design submitted successfully! ID: ${uniqueId}\n${images.length} images captured.`);
      }
    } catch (error) {
      console.error('❌ Failed to submit design:', error);
      alert('Failed to submit design. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      {/* Info Button - Top Right Corner */}
      <button
        onClick={() => setShowInfoPopup(true)}
        style={{
          position: 'fixed',
          top: isMobile ? '10px' : '20px',
          right: isMobile ? '10px' : '20px',
          width: isMobile ? '36px' : '48px',
          height: isMobile ? '36px' : '48px',
          borderRadius: '50%',
          backgroundColor: '#4A90E2',
          color: 'white',
          border: 'none',
          fontSize: isMobile ? '18px' : '24px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#357ABD';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#4A90E2';
          e.target.style.transform = 'scale(1)';
        }}
        title="Help & Instructions"
      >
        ?
      </button>
      
      <div className="customization-panel">
        <CustomizationPanel 
          modelId={modelId}
          onModelIdChange={setModelId}
          stitchColor={stitchColor} 
          onStitchColorChange={setStitchColor}
          fabricColor={fabricColor}
          onFabricColorChange={setFabricColor}
          fabricType={fabricType}
          onFabricTypeChange={setFabricType}
          patternId={patternId}
          onPatternChange={setPatternId}
          seatType={seatType}
          onSeatTypeChange={handleSeatTypeChange}
          meshCustomizations={meshCustomizations}
          onMeshCustomizationChange={handleMeshCustomizationChange}
          showIndividualControls={showIndividualControls}
          onToggleIndividualControls={() => setShowIndividualControls(!showIndividualControls)}
          onMeshHighlight={handleMeshHighlight}
          onMeshUnhighlight={handleMeshUnhighlight}
        />
      </div>
      <div className="scene-container">
        <Scene3D 
          ref={scene3DRef}
          modelId={modelId}
          stitchColor={stitchColor} 
          fabricColor={fabricColor}
          fabricType={fabricType}
          patternId={patternId}
          meshCustomizations={meshCustomizations}
          highlightedMesh={highlightedMesh}
          onPartRightClick={handlePartRightClick}
          seatType={seatType}
          onResetModel={handleResetModel}
          glowEditableParts={glowEditableParts}
        />
      </div>
      
      {/* Part Customization Popup */}
      {popupState && (
        <PartCustomizationPopup
          partName={popupState.partName}
          position={popupState.position}
          onClose={handlePopupClose}
          currentCustomization={popupState.partName === 'two-tone-selector' ? { fabricColor: twoToneColor, patternId: twoTonePattern } : meshCustomizations[popupState.partName]}
          onApply={popupState.partName === 'two-tone-selector' ? (customization) => {
            setTwoToneColor(customization.fabricColor);
            setTwoTonePattern(customization.patternId);
          } : handlePopupApply}
          modelId={modelId}
          seatType={seatType}
          fabricColor={fabricColor}
          globalPatternId={patternId}
          isTwoToneSelector={popupState.partName === 'two-tone-selector'}
        />
      )}
      
      {/* Toast Notifications - Show up to 3 toasts stacked */}
      <div style={{
        position: 'fixed',
        bottom: isMobile ? '15px' : '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10001,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
        alignItems: 'center'
      }}>
        {toasts.slice(-3).map((toast, index) => (
          <Toast 
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={3000}
            index={index}
          />
        ))}
      </div>
      
      {/* Submit Button */}
      <SubmitButton onSubmit={handleSubmit} disabled={isSubmitting} />
      
      {/* Info Popup */}
      {showInfoPopup && (
        <InfoPopup onClose={() => setShowInfoPopup(false)} />
      )}
    </div>
  )
}

export default App
