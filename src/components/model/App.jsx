import { useState, useRef } from 'react';
import { Box, IconButton, Tooltip, Stack, useTheme, useMediaQuery } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Scene3D from './components/3D/Scene3D';
import CustomizationPanel from './components/CustomizationPanel';
import PartCustomizationPopup from './components/PartCustomizationPopup';
import SubmitButton from './components/SubmitButton';
import Toast from './components/Toast';
import InfoPopup from './components/InfoPopup';

function App({ onSubmit }) {
  const scene3DRef = useRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [modelId, setModelId] = useState('1');
  const [stitchColor, setStitchColor] = useState('#ffffff');
  const [fabricColor, setFabricColor] = useState('#dfdfdf');
  const [fabricType, setFabricType] = useState('leather');
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
      const comboPairs = {
        'seat_back_lower_Left': 'seat_back_lower_Right',
        'seat_back_lower_Right': 'seat_back_lower_Left',
        'seat_bottom_lower_Left': 'seat_bottom_lower_Right',
        'seat_bottom_lower_Right': 'seat_bottom_lower_Left',
        'left_arm_upper': 'right_arm_upper',
        'right_arm_upper': 'left_arm_upper'
      };

      const pairedPart = comboPairs[partName];
      const currentState = partClickStates[partName] || 0;
      let nextState;
      let customization;
      let toastMessage;

      if (currentState === 0) {
        nextState = 1;
        customization = {
          fabricColor: twoToneColor,
          patternId: 'default'
        };
        toastMessage = `✓ Custom color applied to ${formatPartName(partName)}`;
      } else if (currentState === 1) {
        nextState = 2;
        customization = {
          fabricColor: twoToneColor,
          patternId: twoTonePattern
        };
        toastMessage = `✓ Pattern & stitching applied to ${formatPartName(partName)}`;
      } else if (currentState === 2) {
        nextState = 3;
        customization = {
          fabricColor: twoToneColor,
          patternId: 'default'
        };
        toastMessage = `✓ Pattern removed from ${formatPartName(partName)}`;
      } else {
        nextState = 0;
        customization = null;
        toastMessage = `✓ ${formatPartName(partName)} reset to base color`;
      }

      setPartClickStates(prev => {
        const updated = {
          ...prev,
          [partName]: nextState
        };
        if (pairedPart) {
          updated[pairedPart] = nextState;
        }
        return updated;
      });

      if (customization === null) {
        setMeshCustomizations(prev => {
          const updated = { ...prev };
          delete updated[partName];
          if (pairedPart) {
            delete updated[pairedPart];
          }
          return updated;
        });
      } else {
        handleMeshCustomizationChange(partName, customization);
        if (pairedPart) {
          handleMeshCustomizationChange(pairedPart, customization);
        }
      }

      const toastId = Date.now() + Math.random();
      setToasts(prev => [...prev, { id: toastId, message: toastMessage, type: 'success' }]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }, 3000);
    } else {
      const toastId = Date.now() + Math.random();
      setToasts(prev => [...prev, { id: toastId, message: 'Please select a valid area', type: 'error' }]);
      setGlowEditableParts(true);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId));
      }, 3000);
      setTimeout(() => setGlowEditableParts(false), 2000);
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

  const handleResetModel = () => {
    console.log('🔄 Resetting model to default settings');
    setModelId('1');
    setFabricType('leather');
    setFabricColor('#dfdfdf');
    setStitchColor('#ffffff');
    setPatternId('default');
    setMeshCustomizations({});
    setSavedTwoToneCustomizations({});
    setPartClickStates({});
    setTwoToneColor('#dfdfdf');
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

    console.log('✅ Model reset to defaults');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('📸 Starting image capture...');
      const images = await scene3DRef.current.captureImages();
      const uniqueId = `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log(`✅ Captured ${images.length} images with ID: ${uniqueId}`);

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
            top: { xs: 10, md: 20 },
            right: { xs: 10, md: 20 },
            bgcolor: 'primary.main',
            color: 'white',
            boxShadow: 3,
            zIndex: 1000,
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>

      <Box sx={{
        width: { xs: '100%', md: '30%' },
        height: { xs: '40vh', md: '100%' },
        overflowY: 'auto',
        borderRight: { md: 1 },
        borderBottom: { xs: 1, md: 0 },
        borderColor: 'divider',
        bgcolor: 'background.paper',
        flexShrink: 0
      }}>
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
        />
      </Box>

      <Box sx={{
        width: { xs: '100%', md: '70%' },
        height: { xs: '60vh', md: '100%' },
        position: 'relative',
        flexGrow: 1
      }}>
        <Scene3D
          ref={scene3DRef}
          modelId={modelId}
          stitchColor={stitchColor}
          fabricColor={fabricColor}
          fabricType={fabricType}
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
          modelId={modelId}
          seatType={seatType}
          fabricColor={fabricColor}
          globalPatternId={patternId}
          isTwoToneSelector={popupState.partName === 'two-tone-selector'}
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

      {/* Submit Button */}
      <SubmitButton onSubmit={handleSubmit} disabled={isSubmitting} />

      {/* Info Popup */}
      {showInfoPopup && (
        <InfoPopup onClose={() => setShowInfoPopup(false)} />
      )}
    </Box>
  );
}

export default App;
