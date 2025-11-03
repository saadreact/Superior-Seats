import { useState, useRef } from 'react'
import Scene3D from './components/3D/Scene3D'
import CustomizationPanel from './components/CustomizationPanel'
import PartCustomizationPopup from './components/PartCustomizationPopup'
import SubmitButton from './components/SubmitButton'
import './App.css'

function App() {
  const scene3DRef = useRef();
  const [modelId, setModelId] = useState('1'); // New state for model selection
  const [stitchColor, setStitchColor] = useState('#ffffff');
  const [fabricColor, setFabricColor] = useState('#dfdfdfff'); // Default grey color
  const [fabricType, setFabricType] = useState('leather');
  const [patternId, setPatternId] = useState('default'); // New state for pattern selection
  const [seatType, setSeatType] = useState('single'); // 'single' or 'two-tone'
  const [meshCustomizations, setMeshCustomizations] = useState({});
  const [savedTwoToneCustomizations, setSavedTwoToneCustomizations] = useState({});
  const [showIndividualControls, setShowIndividualControls] = useState(false);
  const [highlightedMesh, setHighlightedMesh] = useState(null);
  const [popupState, setPopupState] = useState(null); // { partName, position }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMeshCustomizationChange = (meshName, customization) => {
    setMeshCustomizations(prev => ({
      ...prev,
      [meshName]: customization
    }));
  };

  const handleMeshHighlight = (meshName) => {
    setHighlightedMesh(meshName);
  };

  // Seat type change handler that preserves/restores two-tone edits
  const handleSeatTypeChange = (nextType) => {
    if (nextType === 'single') {
      // Save current two-tone customizations and clear them from view
      setSavedTwoToneCustomizations(meshCustomizations);
      setMeshCustomizations({});
      setSeatType('single');
    } else if (nextType === 'two-tone') {
      // Restore saved two-tone customizations if available
      setMeshCustomizations(prev => Object.keys(savedTwoToneCustomizations).length ? savedTwoToneCustomizations : prev);
      setSeatType('two-tone');
    }
  };

  const handleMeshUnhighlight = () => {
    setHighlightedMesh(null);
  };

  const handlePartRightClick = (partName, position) => {
    // Only allow right-click customization in two-tone mode
    if (seatType === 'two-tone') {
      setPopupState({ partName, position });
    }
  };

  const handlePopupClose = () => {
    setPopupState(null);
  };

  const handlePopupApply = (customization) => {
    if (popupState) {
      console.log(`🎯 Applying customization to ${popupState.partName}:`, customization);
      handleMeshCustomizationChange(popupState.partName, customization);
    }
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
      
      // In a real application, you would send these to a backend API
      // For now, we'll download them locally
      images.forEach((img, index) => {
        const link = document.createElement('a');
        link.download = `${uniqueId}_${img.angle}.png`;
        link.href = img.dataUrl;
        link.click();
      });
      
      // Also save configuration as JSON
      const config = {
        id: uniqueId,
        timestamp: new Date().toISOString(),
        modelId,
        fabricType,
        fabricColor,
        stitchColor,
        patternId,
        seatType,
        meshCustomizations
      };
      
      const configBlob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const configLink = document.createElement('a');
      configLink.download = `${uniqueId}_config.json`;
      configLink.href = URL.createObjectURL(configBlob);
      configLink.click();
      
      alert(`Design submitted successfully! ID: ${uniqueId}\n${images.length} images captured.`);
    } catch (error) {
      console.error('❌ Failed to capture images:', error);
      alert('Failed to submit design. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
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
        />
      </div>
      
      {/* Part Customization Popup */}
      {popupState && (
        <PartCustomizationPopup
          partName={popupState.partName}
          position={popupState.position}
          onClose={handlePopupClose}
          currentCustomization={meshCustomizations[popupState.partName]}
          onApply={handlePopupApply}
          modelId={modelId}
          seatType={seatType}
          fabricColor={fabricColor}
        />
      )}
      
      {/* Submit Button */}
      <SubmitButton onSubmit={handleSubmit} disabled={isSubmitting} />
    </div>
  )
}

export default App
