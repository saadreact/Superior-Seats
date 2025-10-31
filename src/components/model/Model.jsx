import { useState } from 'react'
import Scene3D from './3D/Scene3D'
import CustomizationPanel from './CustomizationPanel'
import './model.css'

function Model() {
  const [modelId, setModelId] = useState('1'); // New state for model selection
  const [stitchColor, setStitchColor] = useState('#ffffff');
  const [fabricColor, setFabricColor] = useState('#ffffff');
  const [fabricType, setFabricType] = useState('leather');
  const [patternId, setPatternId] = useState('default'); // New state for pattern selection
  const [meshCustomizations, setMeshCustomizations] = useState({});
  const [showIndividualControls, setShowIndividualControls] = useState(false);
  const [highlightedMesh, setHighlightedMesh] = useState(null);

  const handleMeshCustomizationChange = (meshName, customization) => {
    setMeshCustomizations(prev => ({
      ...prev,
      [meshName]: customization
    }));
  };

  const handleMeshHighlight = (meshName) => {
    setHighlightedMesh(meshName);
  };

  const handleMeshUnhighlight = () => {
    setHighlightedMesh(null);
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
          modelId={modelId}
          stitchColor={stitchColor} 
          fabricColor={fabricColor}
          fabricType={fabricType}
          patternId={patternId}
          meshCustomizations={meshCustomizations}
          highlightedMesh={highlightedMesh}
        />
      </div>
    </div>
  )
}

export default Model
