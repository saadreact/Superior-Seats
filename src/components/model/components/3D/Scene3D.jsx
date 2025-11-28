import React, { Suspense, useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Button, Stack, Tooltip, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import Model3D from './Model3D';

function LoadingFallback() {
  const groupRef = useRef();
  const ringRef = useRef();
  const sphereRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate the ring
    if (ringRef.current) {
      ringRef.current.rotation.x += 0.03;
      ringRef.current.rotation.y += 0.02;
    }

    // Pulse the sphere
    if (sphereRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.2;
      sphereRef.current.scale.set(scale, scale, scale);
    }

    // Gentle rotation of the whole group
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Rotating ring loader */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.08, 16, 32]} />
        <meshStandardMaterial
          color="#007bff"
          emissive="#0056b3"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Inner pulsing sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#007bff"
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Ambient light for the loader */}
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#007bff" />
    </group>
  );
}

// Lighting environment presets
const LIGHTING_ENVIRONMENTS = {
  // bright: {
  //   name: 'Bright Studio',
  //   ambientIntensity: 0.6,
  //   ambientColor: '#ffffff',
  //   keyLightIntensity: 2.5,
  //   fillLightIntensity: 1.5,
  //   rimLightIntensity: 1.0,
  //   spotLightIntensity: 2.0,
  //   backgroundColor: '#f5f5f5',
  //   ambientStrength: 1.0
  // },
  daylight: {
    name: 'Daylight Neutral',
    ambientIntensity: 0.4,
    ambientColor: '#ffffff',
    keyLightIntensity: 2.2,
    fillLightIntensity: 1.2,
    rimLightIntensity: 0.8,
    spotLightIntensity: 1.5,
    backgroundColor: '#f5f5f5',
    ambientStrength: 0.5
  }
  // dark: {
  //   name: 'Dark Moody',
  //   ambientIntensity: 0.2,
  //   ambientColor: '#6699cc',
  //   keyLightIntensity: 1.8,
  //   fillLightIntensity: 0.8,
  //   rimLightIntensity: 0.5,
  //   spotLightIntensity: 1.0,
  //   backgroundColor: '#2a2a3a',
  //   ambientStrength: 0.3
  // }
};

const Scene3D = forwardRef(({
  modelFileUrl, // NEW prop
  modelId,
  stitchColor,
  fabricColor,
  fabricType,
  patternId,
  meshCustomizations,
  highlightedMesh,
  onPartRightClick,
  seatType,
  onResetModel,
  glowEditableParts
}, ref) => {
  const controlsRef = useRef();
  const canvasRef = useRef();
  const [lightingEnv, setLightingEnv] = useState('daylight');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Log model source for debugging
  useEffect(() => {
    console.log('🎨 Scene3D loading model:', {
      source: modelFileUrl ? 'API' : 'Default',
      url: modelFileUrl || '/models/chair.glb'
    });
  }, [modelFileUrl]);

  const currentEnv = LIGHTING_ENVIRONMENTS[lightingEnv];

  // Expose capture function to parent
  useImperativeHandle(ref, () => ({
    captureImages: async () => {
      const images = [];
      const angles = [
        { position: [3, 2, 3], name: 'front-right' },
        { position: [-3, 2, 3], name: 'front-left' },
        { position: [3, 2, -3], name: 'back-right' },
        { position: [-3, 2, -3], name: 'back-left' },
        { position: [0, 5, 0], name: 'top' },
        { position: [4, 1, 0], name: 'side-right' }
      ];

      for (const angle of angles) {
        // Move camera to position
        if (controlsRef.current) {
          controlsRef.current.object.position.set(...angle.position);
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
        }

        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 300));

        // Capture screenshot
        if (canvasRef.current) {
          const canvas = canvasRef.current.querySelector('canvas');
          if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            images.push({ angle: angle.name, dataUrl });
          }
        }
      }

      // Reset camera
      if (controlsRef.current) {
        controlsRef.current.object.position.set(3, 2, 3);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }

      return images;
    }
  }));

  // Prevent browser context menu globally
  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', preventContextMenu);

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  const resetCamera = () => {
    if (controlsRef.current) {
      // Reset camera position
      controlsRef.current.object.position.set(3, 2, 3);
      // Reset target/lookAt
      controlsRef.current.target.set(0, 0, 0);
      // Update controls
      controlsRef.current.update();
    }
  };

  return (
    <Box ref={canvasRef} sx={{
      width: '100%',
      height: '100%',
      bgcolor: currentEnv.backgroundColor,
      position: 'relative',
      m: 0,
      p: 0
    }}>
      <Canvas
        camera={{
          position: [3, 2, 3],
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          preserveDrawingBuffer: true
        }}
        shadows
        style={{ background: currentEnv.backgroundColor }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Set scene background dynamically */}
        <color attach="background" args={[currentEnv.backgroundColor]} />
        {/* Dynamic lighting setup based on environment */}
        <ambientLight intensity={currentEnv.ambientIntensity} color={currentEnv.ambientColor} />

        {/* Main key light */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={currentEnv.keyLightIntensity}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0001}
        />

        {/* Fill light from opposite side */}
        <directionalLight
          position={[0, 6, -3]}
          intensity={currentEnv.fillLightIntensity}
          color="#fff8e1"
        />

        {/* Top rim light for definition */}
        <directionalLight
          position={[0, 10, -6]}
          intensity={currentEnv.rimLightIntensity}
          color="#ffffff"
        />

        {/* Additional spot for material highlights */}
        <spotLight
          position={[0, 6, 8]}
          angle={0.3}
          penumbra={0.1}
          intensity={currentEnv.spotLightIntensity}
          color="#ffffff"
        />

        {/* Chair Model with Suspense for loading */}
        <Suspense fallback={<LoadingFallback />}>
          <Model3D
            modelFileUrl={modelFileUrl} // Pass dynamic URL
            modelId={modelId}
            stitchColor={stitchColor}
            fabricColor={fabricColor}
            fabricType={fabricType}
            patternId={patternId}
            meshCustomizations={meshCustomizations}
            highlightedMesh={highlightedMesh}
            ambientStrength={currentEnv.ambientStrength}
            onPartRightClick={onPartRightClick}
            seatType={seatType}
            glowEditableParts={glowEditableParts}
          />
        </Suspense>

        {/* Ground shadow removed for maximum brightness */}

        {/* Controls - Rotation and zoom around model origin */}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          enableDamping={true}
          dampingFactor={0.05}
          target={[0, 0, 0]}
          zoomSpeed={0.5}
          minDistance={0.8}
          maxDistance={3}
          autoRotate={false}
        />
      </Canvas>

      {/* Lighting Environment Controls */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 10,
          flexWrap: 'wrap',
          maxWidth: 'calc(100% - 20px)'
        }}
      >
        {Object.entries(LIGHTING_ENVIRONMENTS).map(([key, env]) => (
          <Tooltip key={key} title={`Switch to ${env.name} lighting`}>
            <Button
              onClick={() => setLightingEnv(key)}
              size="small"
              sx={{
                minWidth: 'auto',
                px: isMobile ? 1 : 2,
                py: isMobile ? 0.5 : 1,
                bgcolor: lightingEnv === key ? 'primary.main' : 'rgba(255, 255, 255, 0.85)',
                color: lightingEnv === key ? 'white' : 'text.primary',
                border: lightingEnv === key ? 'none' : 1,
                borderColor: 'divider',
                borderRadius: 1,
                fontSize: isMobile ? '0.65rem' : '0.8rem',
                fontWeight: lightingEnv === key ? 600 : 500,
                boxShadow: lightingEnv === key ? 2 : 1,
                backdropFilter: 'blur(10px)',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: lightingEnv === key ? 'primary.dark' : 'rgba(255, 255, 255, 0.95)',
                  transform: 'translateY(-1px)',
                  boxShadow: 3
                },
                transition: 'all 0.2s ease'
              }}
            >
              {env.name}
            </Button>
          </Tooltip>
        ))}
      </Stack>

      {/* Reset Buttons Container */}
      <Stack
        direction="row"
        spacing={isMobile ? 1 : 1.5}
        sx={{
          position: 'absolute',
          bottom: isMobile ? 80 : 20,
          left: 10,
          right: 10,
          zIndex: 10,
          justifyContent: isMobile ? 'center' : 'flex-start'
        }}
      >
        {/* Reset View Button */}
        <Tooltip title="Reset camera to default position">
          <Button
            onClick={resetCamera}
            startIcon={<CameraswitchIcon />}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2,
              px: isMobile ? 1.5 : 2.5,
              py: isMobile ? 1 : 1.5,
              fontSize: isMobile ? '0.7rem' : '0.875rem',
              fontWeight: 600,
              boxShadow: 3,
              backdropFilter: 'blur(10px)',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'translateY(-2px)',
                boxShadow: 4
              },
              transition: 'all 0.2s ease'
            }}
          >
            Reset View
          </Button>
        </Tooltip>

        {/* Reset Model Button */}
        <Tooltip title="Reset model to default settings">
          <Button
            onClick={() => setShowResetConfirm(true)}
            startIcon={<RestartAltIcon />}
            sx={{
              bgcolor: 'error.main',
              color: 'white',
              borderRadius: 2,
              px: isMobile ? 1.5 : 2.5,
              py: isMobile ? 1 : 1.5,
              fontSize: isMobile ? '0.7rem' : '0.875rem',
              fontWeight: 600,
              boxShadow: 3,
              backdropFilter: 'blur(10px)',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'error.dark',
                transform: 'translateY(-2px)',
                boxShadow: 4
              },
              transition: 'all 0.2s ease'
            }}
          >
            Reset Model
          </Button>
        </Tooltip>
      </Stack>
      {/* Reset Confirmation Dialog */}
      <Dialog
        open={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle>Reset All Customizations?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will clear all your customizations and return the seat to default settings.
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetConfirm(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowResetConfirm(false);
              onResetModel();
            }}
            color="error"
            variant="contained"
            autoFocus
          >
            Reset All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

Scene3D.displayName = 'Scene3D';

export default Scene3D;
