import React, { Suspense, useRef, useState, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Button, Stack, Tooltip, useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Typography, Fade } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import Model3D from './Model3D';

// Simple 3D loading fallback for inside Canvas
function LoadingFallback3D() {
  return (
    <mesh>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color="#1976d2" transparent opacity={0.5} />
    </mesh>
  );
}

// 2D Loading overlay component (rendered outside Canvas)
function LoadingOverlay({ isLoading }) {
  const theme = useTheme();
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        gap: 3
      }}
    >
      <Fade in={isLoading} timeout={500}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
          />
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: theme.palette.text.primary,
                fontWeight: 500,
                mb: 0.5
              }}
            >
              Loading 3D Model
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: theme.palette.text.secondary,
                fontStyle: 'italic'
              }}
            >
              Preparing your customization{dots}
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
}

// Studio lighting environment - designed to look good from all angles
const LIGHTING_ENVIRONMENTS = {
  studio: {
    name: 'Studio Lighting',
    ambientIntensity: 0.5,
    ambientColor: '#ffffff',
    backgroundColor: '#f5f5f5',
    ambientStrength: 0.6
  }
};

const Scene3D = forwardRef(({
  modelFileUrl, // NEW prop
  modelId,
  stitchColor, // Internal stitching (pattern stitching)
  externalStitchColor, // External stitching (edges)
  pipingColor, // Piping color
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
  const [lightingEnv, setLightingEnv] = useState('studio');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate average light direction from multiple studio lights for shader
  // This provides a balanced lighting direction that works from all angles
  const studioLightDirection = useMemo(() => {
    // Average direction from multiple studio lights positioned around the model
    // Key light (front-right-top), Fill light (front-left), Rim light (back-top)
    const keyDir = new THREE.Vector3(-5, -8, -5).normalize();
    const fillDir = new THREE.Vector3(0, -6, 3).normalize();
    const rimDir = new THREE.Vector3(0, -10, 6).normalize();
    const avgDir = keyDir.add(fillDir).add(rimDir).normalize();
    return [avgDir.x, avgDir.y, avgDir.z];
  }, []);

  // Log model source for debugging and reset loading state when model changes
  useEffect(() => {
    console.log('🎨 Scene3D loading model:', {
      source: modelFileUrl ? 'API' : 'Default',
      url: modelFileUrl || '/models/chair.glb'
    });
    // Reset loading state when model changes
    setIsLoading(true);
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
      p: 0,
      overflow: 'hidden', // Prevent horizontal overflow
      maxWidth: '100%' // Ensure it doesn't exceed container width
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
        
        {/* Studio Lighting Setup - Multi-light configuration for natural look from all angles */}
        
        {/* Ambient light for base illumination */}
        <ambientLight intensity={currentEnv.ambientIntensity} color={currentEnv.ambientColor} />
        
        {/* Hemisphere light for natural sky/ground lighting */}
        <hemisphereLight
          args={['#ffffff', '#888888', 0.4]}
          position={[0, 10, 0]}
        />

        {/* Main Key Light - Front-right-top (primary light source) */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={2.0}
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

        {/* Fill Light - Front-left (softens shadows) */}
        <directionalLight
          position={[-4, 6, 3]}
          intensity={1.2}
          color="#fff8e1"
        />

        {/* Rim Light - Back-top (edge definition) */}
        <directionalLight
          position={[0, 10, -6]}
          intensity={0.9}
          color="#ffffff"
        />

        {/* Accent Light 1 - Right side (adds depth) */}
        <directionalLight
          position={[6, 4, 0]}
          intensity={0.8}
          color="#ffffff"
        />

        {/* Accent Light 2 - Left side (balances right side) */}
        <directionalLight
          position={[-6, 4, 0]}
          intensity={0.7}
          color="#fff8e1"
        />

        {/* Top Light - Direct overhead (eliminates harsh shadows) */}
        <directionalLight
          position={[0, 12, 0]}
          intensity={0.6}
          color="#ffffff"
        />

        {/* Front Spot Light - Material highlights */}
        <spotLight
          position={[0, 6, 8]}
          angle={0.4}
          penumbra={0.2}
          intensity={1.2}
          color="#ffffff"
        />

        {/* Back Spot Light - Rim highlights */}
        <spotLight
          position={[0, 5, -8]}
          angle={0.35}
          penumbra={0.15}
          intensity={0.8}
          color="#ffffff"
        />

        {/* Chair Model with Suspense for loading */}
        <Suspense fallback={<LoadingFallback3D />}>
          <Model3D
            modelFileUrl={modelFileUrl} // Pass dynamic URL
            modelId={modelId}
            stitchColor={stitchColor}
            externalStitchColor={externalStitchColor}
            pipingColor={pipingColor}
            fabricColor={fabricColor}
            fabricType={fabricType}
            patternId={patternId}
            meshCustomizations={meshCustomizations}
            highlightedMesh={highlightedMesh}
            ambientStrength={currentEnv.ambientStrength}
            onPartRightClick={onPartRightClick}
            seatType={seatType}
            glowEditableParts={glowEditableParts}
            onLoadComplete={() => setIsLoading(false)}
            lightDirection={studioLightDirection}
            lightIntensity={2.0}
          />
        </Suspense>

        {/* Ground shadow removed for maximum brightness */}

        {/* Controls - Rotation and zoom around model origin */}
        {/* In two-tone mode, allow rotation on drag, but clicks will be handled by Model3D */}
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

      {/* Loading Overlay */}
      <LoadingOverlay isLoading={isLoading} />

      {/* Lighting Environment Controls */}
      {/* <Stack
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
      </Stack> */}

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
