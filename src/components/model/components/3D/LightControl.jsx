import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Slider, Tooltip, Paper } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import * as THREE from 'three';

/**
 * Draggable light control widget
 * Allows users to drag a light bulb icon to control main light direction
 * Also includes intensity slider
 * 
 * This is a fixed UI overlay, not a 3D positioned element
 */
function LightControl({ onLightChange, initialPosition = [5, 8, 5], initialIntensity = 2.2 }) {
  const [isDragging, setIsDragging] = useState(false);
  const [lightPosition, setLightPosition] = useState(new THREE.Vector3(...initialPosition));
  const [intensity, setIntensity] = useState(initialIntensity);
  const [isExpanded, setIsExpanded] = useState(false);
  const [iconPosition, setIconPosition] = useState({ x: 50, y: 50 }); // Fixed initial position in top-left area
  const dragStartRef = useRef(null);
  const lightRef = useRef(null);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPos: { ...iconPosition }
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (!dragStartRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      // Update icon position on screen
      const newIconPos = {
        x: dragStartRef.current.startPos.x + deltaX,
        y: dragStartRef.current.startPos.y + deltaY
      };

      // Clamp to screen bounds (with padding)
      const padding = 30;
      newIconPos.x = Math.max(padding, Math.min(window.innerWidth - padding, newIconPos.x));
      newIconPos.y = Math.max(padding, Math.min(window.innerHeight - padding, newIconPos.y));

      setIconPosition(newIconPos);

      // Convert screen position to light direction
      // Map screen position to spherical coordinates for light direction
      const normalizedX = (newIconPos.x / window.innerWidth) * 2 - 1; // -1 to 1
      const normalizedY = (newIconPos.y / window.innerHeight) * 2 - 1; // -1 to 1
      
      // Convert to light direction vector
      // X controls azimuth (left-right), Y controls elevation (up-down)
      const azimuth = normalizedX * Math.PI * 0.5; // -90° to 90°
      const elevation = Math.PI * 0.25 + normalizedY * Math.PI * 0.25; // 45° ± 45° (30° to 90°)
      
      const lightDir = new THREE.Vector3(
        Math.sin(azimuth) * Math.cos(elevation),
        Math.sin(elevation),
        Math.cos(azimuth) * Math.cos(elevation)
      ).normalize();
      
      // Update light position for reference (not used for directional light, but kept for consistency)
      const newPosition = lightDir.clone().multiplyScalar(-10);
      setLightPosition(newPosition);
      
      if (onLightChange) {
        onLightChange({
          position: [newPosition.x, newPosition.y, newPosition.z],
          direction: [lightDir.x, lightDir.y, lightDir.z],
          intensity: intensity
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onLightChange, intensity, iconPosition]);

  const handleIntensityChange = (event, newValue) => {
    setIntensity(newValue);
    // Recalculate light direction from current icon position
    const normalizedX = (iconPosition.x / window.innerWidth) * 2 - 1;
    const normalizedY = (iconPosition.y / window.innerHeight) * 2 - 1;
    const azimuth = normalizedX * Math.PI * 0.5;
    const elevation = Math.PI * 0.25 + normalizedY * Math.PI * 0.25;
    const lightDir = new THREE.Vector3(
      Math.sin(azimuth) * Math.cos(elevation),
      Math.sin(elevation),
      Math.cos(azimuth) * Math.cos(elevation)
    ).normalize();
    
    if (onLightChange) {
      onLightChange({
        position: [lightDir.x * -10, lightDir.y * -10, lightDir.z * -10],
        direction: [lightDir.x, lightDir.y, lightDir.z],
        intensity: newValue
      });
    }
  };

  return (
    <Box
      ref={lightRef}
      onMouseDown={handleMouseDown}
      sx={{
        position: 'fixed',
        left: `${iconPosition.x}px`,
        top: `${iconPosition.y}px`,
        transform: 'translate(-50%, -50%)',
        cursor: isDragging ? 'grabbing' : 'grab',
        pointerEvents: 'auto',
        userSelect: 'none',
        zIndex: 1000,
        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
      }}
    >
        <Tooltip title={isExpanded ? "Click to collapse" : "Drag to move light • Click to expand controls"}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: 3,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            {isExpanded ? <LightbulbIcon sx={{ color: '#ffa726' }} /> : <LightbulbOutlinedIcon sx={{ color: '#ffa726' }} />}
          </IconButton>
        </Tooltip>

        {/* Expanded controls panel */}
        {isExpanded && (
          <Paper
            elevation={4}
            sx={{
              position: 'absolute',
              left: '50px',
              top: '50%',
              transform: 'translateY(-50%)',
              p: 2,
              minWidth: 200,
              pointerEvents: 'auto',
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              zIndex: 1001,
              whiteSpace: 'nowrap'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ mb: 2 }}>
              <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>
                Light Intensity
              </Box>
              <Slider
                value={intensity}
                onChange={handleIntensityChange}
                min={0.5}
                max={5}
                step={0.1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => value.toFixed(1)}
                sx={{
                  '& .MuiSlider-thumb': {
                    color: '#ffa726'
                  },
                  '& .MuiSlider-track': {
                    color: '#ffa726'
                  }
                }}
              />
            </Box>
            <Box sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 2 }}>
              💡 Drag the bulb to move light
            </Box>
          </Paper>
        )}
    </Box>
  );
}

export default LightControl;

