import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Tooltip, Stack, useTheme, useMediaQuery } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Scene3D from './components/3D/Scene3D';
import CustomizationPanel from './components/CustomizationPanel';
import PartCustomizationPopup from './components/PartCustomizationPopup';
import Toast from './components/Toast';
import InfoPopup from './components/InfoPopup';

function App({
  onSubmit,
  modelFileUrl,
  availableMaterials,
  customizeOptions,
  onCustomizationChange
}) {
  const scene3DRef = useRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  const [modelId, setModelId] = useState('1');
  const [stitchColor, setStitchColor] = useState('#ffffff'); // Internal stitching (pattern stitching)
  const [externalStitchColor, setExternalStitchColor] = useState('#ffffff'); // External stitching (edges)
  const [pipingColor, setPipingColor] = useState('#ffffff'); // Piping color
  const [fabricColor, setFabricColor] = useState(null); // Will be set when materials load
  const [fabricType, setFabricType] = useState(null); // Will be set when materials load
  const [patternId, setPatternId] = useState('default');
  const [seatType, setSeatType] = useState('single');
  const [meshCustomizations, setMeshCustomizations] = useState({});
  const [savedTwoToneCustomizations, setSavedTwoToneCustomizations] = useState({});
  const [popupState, setPopupState] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [glowEditableParts, setGlowEditableParts] = useState(false);
  const [twoToneColor, setTwoToneColor] = useState('#dfdfdf');
  const [twoTonePattern, setTwoTonePattern] = useState('default');
  const [partClickStates, setPartClickStates] = useState({});
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [defaultsApplied, setDefaultsApplied] = useState(false);
  const [isModelUpdating, setIsModelUpdating] = useState(false); // Track when model is updating

  // Notify parent component of 3D customization changes for price calculation
  // Use useRef to store previous selections and only call callback when selections actually change
  const prevSelectionsRef = useRef(null);
  
  useEffect(() => {
    if (!onCustomizationChange || !availableMaterials) return;

    const selections = {};

    // Material Type
    if (fabricType) {
      const material = availableMaterials.find(m => m.id.toString() === fabricType);
      if (material) {
        selections.materialType = {
          id: fabricType,
          name: material.name,
          price: material.price ? parseFloat(String(material.price)) : 0
        };
      }
    }

    // Color
    if (fabricColor && fabricType) {
      const material = availableMaterials.find(m => m.id.toString() === fabricType);
      if (material && material.colors) {
        const color = material.colors.find(c => c.hex_code === fabricColor);
        if (color) {
          selections.color = {
            id: String(color.id),
            name: color.name,
            price: color.price ? parseFloat(String(color.price)) : (color.price_tiers && color.price_tiers.length > 0 ? parseFloat(String(color.price_tiers[0].price)) : 0)
          };
        }
      }
    }

    // Pattern
    if (patternId && patternId !== 'default' && customizeOptions?.stitch_patterns) {
      const pattern = customizeOptions.stitch_patterns.find(p => 
        String(p.id) === String(patternId) || 
        p.static_pattern_id === String(patternId)
      );
      if (pattern) {
        selections.pattern = {
          id: String(pattern.id),
          name: pattern.name,
          price: pattern.price ? parseFloat(String(pattern.price)) : (pattern.price_adjustment ? parseFloat(String(pattern.price_adjustment)) : 0)
        };
      }
    }

    // Stitch Color (if pattern has stitch colors)
    if (patternId && patternId !== 'default' && stitchColor && customizeOptions?.stitch_patterns) {
      const pattern = customizeOptions.stitch_patterns.find(p => 
        String(p.id) === String(patternId) || 
        p.static_pattern_id === String(patternId)
      );
      if (pattern && pattern.stitch_colors) {
        const stitchColorObj = pattern.stitch_colors.find(c => c.hex_code === stitchColor);
        if (stitchColorObj) {
          // Check if stitch color has price (may be in price field or price_adjustment)
          const stitchPrice = stitchColorObj.price ? parseFloat(String(stitchColorObj.price)) : 
                             (stitchColorObj.price_adjustment ? parseFloat(String(stitchColorObj.price_adjustment)) : 0);
          selections.stitchColor = {
            id: String(stitchColorObj.id),
            name: stitchColorObj.name,
            price: stitchPrice
          };
        }
      }
    }

    // Add additional customization data for cart
    selections.externalStitchColor = externalStitchColor;
    selections.pipingColor = pipingColor;
    selections.seatType = seatType;
    selections.meshCustomizations = meshCustomizations;

    // Only call callback if selections actually changed (deep comparison)
    const selectionsStr = JSON.stringify(selections);
    if (prevSelectionsRef.current !== selectionsStr) {
      prevSelectionsRef.current = selectionsStr;
      onCustomizationChange(selections);
    }
  }, [fabricType, fabricColor, patternId, stitchColor, externalStitchColor, pipingColor, seatType, meshCustomizations, availableMaterials, customizeOptions]); // Removed onCustomizationChange from deps

  // Set default fabric type and color when materials are loaded (only once)
  useEffect(() => {
    // Only apply defaults once when materials first load
    if (availableMaterials && availableMaterials.length > 0 && !defaultsApplied) {
      const firstMaterial = availableMaterials[0];
      const defaultMaterialId = firstMaterial.id.toString();
      
      // Set default fabric type (first material)
      setFabricType(defaultMaterialId);
      
      // Always use default light grey color (#dfdfdf) on initial load
      setFabricColor('#dfdfdf');
      setTwoToneColor('#dfdfdf');
      
      setDefaultsApplied(true);
    } else if ((!availableMaterials || availableMaterials.length === 0) && !defaultsApplied) {
      // Fallback to hardcoded defaults if no API materials
      console.log('⚠️ No API materials available, using fallback defaults');
      setFabricType('leather');
      setFabricColor('#dfdfdf');
      setTwoToneColor('#dfdfdf');
      setDefaultsApplied(true);
    }
  }, [availableMaterials, defaultsApplied]);

  // List of all customizable parts for two-tone mode
  const CUSTOMIZABLE_PARTS = [
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
  ];
  const handleMeshCustomizationChange = (meshName, customization) => {
    setMeshCustomizations(prev => ({
      ...prev,
      [meshName]: customization
    }));
  };

  const formatPartName = (partName) => {
    return partName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const handleSeatTypeChange = (nextType) => {
    if (nextType === 'single') {
      setMeshCustomizations({});
      setSavedTwoToneCustomizations({});
      setPartClickStates({});
      setSeatType('single');
      setPopupState(null);
    } else if (nextType === 'two-tone') {
      setMeshCustomizations({});
      setPartClickStates({});
      setSeatType('two-tone');

      setPopupState({
        partName: 'two-tone-selector',
        position: { x: window.innerWidth * 0.4, y: 150 }
      });
    }
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

      // Original behavior: Cycle through states on click
      // State 0: No customization (default)
      // State 1: Apply color only
      // State 2: Apply color + pattern
      // State 3: Remove pattern (back to color only)
      // Then cycle back to 0 (reset)
      
      const currentState = partClickStates[partName] || 0;
      let nextState = 0;
      let newCustomization = {};

      switch (currentState) {
        case 0:
          // State 0 -> State 1: Apply color only
          nextState = 1;
          newCustomization = {
            fabricColor: twoToneColor,
            patternId: 'default'
          };
          break;
        case 1:
          // State 1 -> State 2: Apply color + pattern
          nextState = 2;
          newCustomization = {
            fabricColor: twoToneColor,
            patternId: twoTonePattern
          };
          break;
        case 2:
          // State 2 -> State 3: Remove pattern (back to color only)
          nextState = 3;
          newCustomization = {
            fabricColor: twoToneColor,
            patternId: 'default'
          };
          break;
        case 3:
        default:
          // State 3 -> State 0: Reset (remove customization)
          nextState = 0;
          newCustomization = {};
          break;
      }

      // If customization is empty (reset), remove it from meshCustomizations
      if (Object.keys(newCustomization).length === 0) {
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
        handleMeshCustomizationChange(partName, newCustomization);
        // If this is a combo part, also apply to the paired part
        if (pairedPart) {
          handleMeshCustomizationChange(pairedPart, newCustomization);
        }
      }

      // Update the click state
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

      // Show feedback toast
      const stateMessages = {
        0: 'Reset',
        1: 'Color applied',
        2: 'Color + Pattern applied',
        3: 'Pattern removed'
      };
      
      const partDisplayName = formatPartName(partName);
      const pairMessage = pairedPart ? ' (and pair)' : '';
      addToast(`${partDisplayName}${pairMessage}: ${stateMessages[nextState]}`, 'info');
    } else {
      // Invalid part clicked - show warning and highlight valid parts
      const toastId = Date.now() + Math.random();
      setToasts(prev => [...prev, { id: toastId, message: 'Please select a valid area', type: 'error' }]);
      setGlowEditableParts(true);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }, 3000);
      setTimeout(() => setGlowEditableParts(false), 2000);
    }
  };

  const handleApplyToAll = (color, pattern) => {
    // Apply the color and pattern to all customizable parts
    const newCustomizations = {};

    CUSTOMIZABLE_PARTS.forEach(partName => {
      newCustomizations[partName] = {
        fabricColor: color,
        patternId: pattern
      };
    });

    // Update all customizations at once
    setMeshCustomizations(newCustomizations);

    // Update part click states to mark all as customized (state 2 = color + pattern)
    const newClickStates = {};
    CUSTOMIZABLE_PARTS.forEach(partName => {
      newClickStates[partName] = 2;
    });
    setPartClickStates(newClickStates);

    // Show success toast
    addToast(`✓ Applied to all ${CUSTOMIZABLE_PARTS.length} parts!`, 'success');
  };

  const handlePopupClose = () => {
    setPopupState(null);
  };

  const handlePopupApply = (customization) => {
    if (popupState) {
      handleMeshCustomizationChange(popupState.partName, customization);
    }
  };

  // Helper function to add toast notifications
  const addToast = (message, type = 'info') => {
    const toastId = Date.now() + Math.random();
    setToasts(prev => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 2000);
  };

  const handleResetModel = () => {
    setModelId('1');
    
    // Reset to first API material if available, otherwise use 'leather'
    if (availableMaterials && availableMaterials.length > 0) {
      const firstMaterial = availableMaterials[0];
      const defaultMaterialId = firstMaterial.id.toString();
      setFabricType(defaultMaterialId);
      
      // Always reset to default light grey color
      setFabricColor('#dfdfdf');
      setTwoToneColor('#dfdfdf');
    } else {
      setFabricType('leather');
      setFabricColor('#dfdfdf');
      setTwoToneColor('#dfdfdf');
    }
    
    setStitchColor('#ffffff');
    setExternalStitchColor('#ffffff');
    setPipingColor('#ffffff');
    setPatternId('default');
    setMeshCustomizations({});
    setSavedTwoToneCustomizations({});
    setPartClickStates({});
    setTwoTonePattern('default');

    if (seatType === 'two-tone') {
      setSeatType('single');
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

  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const images = await scene3DRef.current.captureImages();
      const uniqueId = `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const configData = {
        id: uniqueId,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        modelId,
        global: {
          fabricType,
          fabricColor,
          stitchColor,
          patternId,
          seatType
        },
        parts: Object.entries(meshCustomizations).map(([partName, customization]) => ({
          partName,
          fabricColor: customization.fabricColor,
          fabricType: customization.fabricType,
          stitchColor: customization.stitchColor,
          patternId: customization.patternId,
          clickState: partClickStates[partName] || 0
        })),
        meshCustomizations,
        partClickStates,
        editableParts: [
          'seat_bottom_upper', 'seat_bottom_lower', 'seat_bottom_lower_Left', 'seat_bottom_lower_Right',
          'seat_back_upper', 'seat_back_lower', 'seat_back_lower_Left', 'seat_back_lower_Right',
          'headset_front', 'headset_back', 'left_arm_upper', 'right_arm_upper'
        ]
      };

      const imagesData = images.map(img => ({
        angle: img.angle,
        dataUrl: img.dataUrl,
        blob: img.blob || null
      }));

      if (onSubmit && typeof onSubmit === 'function') {
        console.log('📤 Calling onSubmit callback...');
        await onSubmit({
          images: imagesData,
          config: configData
        });
        console.log('✅ onSubmit callback completed');
      } else {
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
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      width: '100%',
      height: '100%',
      minHeight: { xs: 'auto', md: 'auto' },
      overflow: 'hidden',
      bgcolor: 'background.default',
      position: 'relative'
    }}>
      {/* Info Button - Top Right Corner */}
      <Tooltip title="Help & Instructions">
        <IconButton
          onClick={() => setShowInfoPopup(true)}
          sx={{
            position: 'absolute',
            top: { xs: 8, md: 20 },
            right: { xs: 8, md: 20 },
            bgcolor: 'primary.main',
            color: 'white',
            boxShadow: 3,
            zIndex: 1000,
            width: { xs: 36, md: 40 },
            height: { xs: 36, md: 40 },
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
        </IconButton>
      </Tooltip>

      <Box sx={{
        width: { xs: '100%', md: '30%' },
        maxWidth: { md: 400 },
        height: { xs: 'auto', md: '100%' },
        maxHeight: { xs: '30vh', sm: '28vh', md: '100%' },
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRight: { md: 1 },
        borderBottom: { xs: 1, md: 0 },
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0,
        WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
      }}>
        <CustomizationPanel
          availableMaterials={availableMaterials} // Pass API materials
          customizeOptions={customizeOptions} // Pass API customize options (stitch_patterns, etc.)
          modelId={modelId}
          onModelIdChange={setModelId}
          stitchColor={stitchColor}
          onStitchColorChange={setStitchColor}
          externalStitchColor={externalStitchColor}
          onExternalStitchColorChange={setExternalStitchColor}
          pipingColor={pipingColor}
          onPipingColorChange={setPipingColor}
          fabricColor={fabricColor}
          onFabricColorChange={setFabricColor}
          fabricType={fabricType}
          onFabricTypeChange={(newFabricType) => {
            // Reset color to default light grey when fabric type changes
            setFabricType(newFabricType);
            setFabricColor('#dfdfdf');
            setTwoToneColor('#dfdfdf');
          }}
          patternId={patternId}
          onPatternChange={setPatternId}
          seatType={seatType}
          onSeatTypeChange={handleSeatTypeChange}
          meshCustomizations={meshCustomizations}
          onMeshCustomizationChange={handleMeshCustomizationChange}
          onOpenTwoToneSelector={() => {
            setPopupState({
              partName: 'two-tone-selector',
              position: { x: window.innerWidth * 0.4, y: 150 }
            });
          }}
        />
      </Box>

      <Box sx={{
        width: { xs: '100%', md: '70%' },
        height: { xs: 'auto', sm: '100%', md: '100%' },
        minHeight: { xs: 300, sm: 450, md: 'auto' },
        position: 'relative',
        flexGrow: 1,
        flexShrink: 0,
        overflow: 'hidden', // Prevent horizontal overflow
        maxWidth: '100%' // Ensure it doesn't exceed container width
      }}>
        <Scene3D
          ref={scene3DRef}
          modelFileUrl={modelFileUrl} // Pass API model URL
          modelId={modelId}
          stitchColor={stitchColor}
          externalStitchColor={externalStitchColor}
          pipingColor={pipingColor}
          fabricColor={fabricColor || '#dfdfdf'} // Fallback to default gray
          fabricType={(() => {
            // Convert material ID to shader_id for 3D rendering
            if (availableMaterials && availableMaterials.length > 0 && fabricType) {
              const material = availableMaterials.find(m => m.id.toString() === fabricType);
              if (material && material.shader_id) {
                // Map shader_id to ShaderManager format if needed
                // Some shader_ids need mapping for backwards compatibility
                const shaderIdMap = {
                  'brisa': 'brisa-distressed', // Legacy alias
                  // Direct mappings (no change needed)
                  'carroll-leather': 'carroll-leather',
                  'miami-corp-cloths': 'miami-corp-cloths',
                  'miami-vinyl': 'miami-vinyl',
                  'ultrafabrics': 'ultrafabrics',
                  'brisa-distressed': 'brisa-distressed'
                };
                return shaderIdMap[material.shader_id] || material.shader_id;
              }
            }
            // Fallback to fabricType as-is (for legacy 'leather', etc.)
            return fabricType || 'leather';
          })()}
          patternId={patternId}
          meshCustomizations={meshCustomizations}
          onPartRightClick={handlePartRightClick}
          seatType={seatType}
          onResetModel={handleResetModel}
          glowEditableParts={glowEditableParts}
        />
      </Box>

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
          onApplyToAll={handleApplyToAll}
          modelId={modelId}
          seatType={seatType}
          fabricColor={fabricColor}
          globalPatternId={patternId}
          isTwoToneSelector={popupState.partName === 'two-tone-selector'}
          availableMaterials={availableMaterials}
          fabricType={fabricType}
          customizeOptions={customizeOptions}
        />
      )}

      {/* Toast Notifications */}
      <Stack
        spacing={1}
        sx={{
          position: 'fixed',
          bottom: { xs: 15, md: 20 },
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10001,
          pointerEvents: 'none',
          alignItems: 'center'
        }}
      >
        {toasts.slice(-3).map((toast, index) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={3000}
            index={index}
          />
        ))}
      </Stack>

      {/* Submit Button removed - now in CustomizedSeat component below price breakdown */}

      {/* Info Popup */}
      {showInfoPopup && (
        <InfoPopup onClose={() => setShowInfoPopup(false)} />
      )}
    </Box>
  );
}

export default App;
