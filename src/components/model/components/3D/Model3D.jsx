import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { getModelConfig, getStitchingPath } from '../../config/assets';
import { ShaderManager } from '../../shaders/ShaderManager';
import { TextureManager } from '../../utils/TextureManager';

function Model3D({ 
  modelId = '1', // New prop for model selection
  stitchColor = '#ffffff',
  fabricColor = '#ffffff',
  fabricType = 'leather',
  meshCustomizations = {}, // Individual mesh customizations
  highlightedMesh = null, // Mesh name to highlight
  patternId = null, // Pattern ID for dynamic pattern loading
  ambientStrength = 0.5, // Ambient lighting strength from environment
  onPartRightClick = null, // Left-click handler for parts in two-tone mode
  seatType = 'single', // Seat type (single or two-tone)
  glowEditableParts = false // Trigger glow effect on editable parts
}) {
  const meshRef = useRef();
  const materialsRef = useRef(new Map()); // Track materials for updates
  const originalTexturesRef = useRef(null); // Store original textures for default pattern
  const originalMaterialsRef = useRef(new Map()); // Store original materials for glow effect
  const texturesRef = useRef(null); // Store loaded textures
  const [texturesLoaded, setTexturesLoaded] = useState(false); // Track texture loading state
  
  // Get model configuration dynamically based on modelId
  const modelConfig = useMemo(() => getModelConfig(modelId), [modelId]);
  
  // Load GLTF model and base textures dynamically based on modelId
  const { scene } = useGLTF(modelConfig.model);
  
  // Memoize texture paths to prevent unnecessary reloads
  // In two-tone mode, always use default textures (no global pattern)
  const diamondNormalPath = useMemo(() => {
    // In two-tone mode, don't use global pattern for base textures
    const effectivePatternId = seatType === 'two-tone' ? null : patternId;
    
    if (effectivePatternId && effectivePatternId !== 'default') {
      // Extract pattern info to determine correct path
      const [modelNum, patternNum] = effectivePatternId.split('-');
      if (patternNum === '1') {
        return `/assets/patterns/${modelNum}/1.jpg`;
      } else {
        return `/assets/patterns/${modelNum}/0${patternNum}.jpg`;
      }
    }
    return modelConfig.textures.diamondNormal; // Default diamond normal
  }, [patternId, modelConfig.textures.diamondNormal, seatType]);
  
  const stitchingTexturePath = useMemo(() => {
    // In two-tone mode, don't use global pattern for base textures
    const effectivePatternId = seatType === 'two-tone' ? 'default' : (patternId || 'default');
    return getStitchingPath(modelId, effectivePatternId);
  }, [modelId, patternId, seatType]);
  
  const externalStitchingPath = useMemo(() => {
    return `/assets/externalStitchings/${modelId}/1.png`;
  }, [modelId]);
  
  // Load textures using TextureManager (no re-renders)
  useEffect(() => {
    const loadTextures = async () => {
      try {
        const loaded = await TextureManager.loadTextures({
          diamondNormal: diamondNormalPath,
          ao: modelConfig.textures.ao,
          stitch: stitchingTexturePath,
          externalStitch: externalStitchingPath
        }, {
          diamondNormal: { colorSpace: THREE.NoColorSpace, flipY: false },
          ao: { colorSpace: THREE.NoColorSpace, flipY: false },
          stitch: { colorSpace: THREE.SRGBColorSpace, flipY: false },
          externalStitch: { colorSpace: THREE.SRGBColorSpace, flipY: false }
        });
        
        // In two-tone mode, replace stitch with dummy texture
        if (seatType === 'two-tone') {
          const dummyCanvas = document.createElement('canvas');
          dummyCanvas.width = 1;
          dummyCanvas.height = 1;
          loaded.stitch = new THREE.CanvasTexture(dummyCanvas);
        }
        
        texturesRef.current = loaded;
        originalTexturesRef.current = { ...loaded };
        setTexturesLoaded(true);
      } catch (error) {
        console.error('Failed to load textures:', error);
      }
    };
    
    loadTextures();
  }, [modelId, diamondNormalPath, stitchingTexturePath, externalStitchingPath, seatType, modelConfig.textures.ao]);
  
  // Define which parts can be customized in two-tone mode (memoized to prevent re-renders)
  const customizableParts = useMemo(() => [
    'seat_bottom_upper',
    'seat_bottom_lower',
    'seat_bottom_lower_Left',
    'seat_bottom_lower_Right',
    'seat_back_upper',
    'seat_back_lower', // Note: typo in original mesh name
    'seat_back_lower_Left',
    'seat_back_lower_Right',
    'headset_front',
    'headset_back',
    'left_arm_upper',
    'right_arm_upper'
  ], []);
  
  // Define seat part categories for material assignment (memoized to prevent re-renders)
  const seatParts = useMemo(() => ({
    base: ['base', 'seat_bottom', 'seat_bottom_upper', 'seat_bottom_lower', 'seat_bottom_lower_Left', 'seat_bottom_lower_Right'],
    backrest: ['seat_back', 'seat_back_upper', 'seat_back_lower', 'seat_back_lower_Left', 'seat_back_lower_Right'],
    headrest: ['headset_front', 'headset_back'],
    armrests: ['left_arm_upper', 'left_arm_lover', 'right_arm_upper', 'right_arm_lower'],
    piping: ['left_arm_piping', 'right_arm_piping', 'piping_lower', 'Shape001'],
    frame: ['bottom_cover']
  }), []);
  
  // Material configurations for different parts (structure only - colors resolved at runtime)
  const materialConfigs = useMemo(() => ({
    base: { fabricType: 'leather', hasStitching: true, name: 'Seat Base', useFabricColor: true },
    backrest: { fabricType: 'leather', hasStitching: true, name: 'Backrest', useFabricColor: true },
    headrest: { fabricType: 'leather', hasStitching: true, name: 'Headrest', useFabricColor: true },
    armrests: { fabricType: 'leather', hasStitching: true, name: 'Armrests', useFabricColor: true },
    piping: { fabricType: 'piping', hasStitching: false, name: 'Piping', useStitchColor: true },
    frame: { color: '#333333', fabricType: 'metal', hasStitching: false, name: 'Frame' }
  }), []);
  
  // Helper function to determine part category
  const getPartCategory = (meshName) => {
    for (const [category, meshNames] of Object.entries(seatParts)) {
      if (meshNames.some(name => meshName.includes(name))) {
        return category;
      }
    }
    return 'frame'; // Default fallback
  };
  
  // Setup material system using ShaderManager (only runs once when textures are loaded)
  useEffect(() => {
    if (!scene || !texturesLoaded || !texturesRef.current) return;
    
    console.log('🚨 MATERIAL CREATION EFFECT - All materials being recreated');
    let partCounts = {};
    const patternUpdatePromises = [];
    const allMeshNames = [];
    
    scene.traverse((child) => {
      if (child.isMesh) {
        allMeshNames.push(child.name);
        const partCategory = getPartCategory(child.name);
        const config = materialConfigs[partCategory];
        partCounts[partCategory] = (partCounts[partCategory] || 0) + 1;
        
        // Get customizations for this specific mesh
        const meshCustomization = meshCustomizations[child.name] || {};
        
        // Resolve color at runtime
        let configColor = config.color || (config.useFabricColor ? fabricColor : (config.useStitchColor ? stitchColor : '#ffffff'));
        let finalFabricColor = meshCustomization.fabricColor || configColor;
        const finalStitchColor = meshCustomization.stitchColor || stitchColor;
        const finalFabricType = meshCustomization.fabricType || (config.fabricType || fabricType);
        
        // In two-tone mode, only use custom patterns, not the global pattern
        const finalPatternId = meshCustomization.patternId || (seatType === 'two-tone' ? null : patternId);
        
        // Keep original color in two-tone mode
        
        // Create material using ShaderManager
        if (finalFabricType === 'metal') {
          // Use standard PBR for metal parts
          child.material = new THREE.MeshStandardMaterial({
            color: finalFabricColor,
            roughness: 0.3,
            metalness: 0.8,
            envMapIntensity: 1.0,
          });
          
          materialsRef.current.set(child.name, {
            material: child.material,
            type: 'standard',
            fabricColor: finalFabricColor
          });
        } else if (finalFabricType === 'piping') {
          // Use simple standard material for piping (follows stitch color)
          child.material = new THREE.MeshStandardMaterial({
            color: finalFabricColor,
            roughness: 0.4,
            metalness: 0.0,
            envMapIntensity: 0.5,
          });
          
          materialsRef.current.set(child.name, {
            material: child.material,
            type: 'piping',
            fabricColor: finalFabricColor,
            stitchColor: finalStitchColor
          });
        } else {
          // Use ShaderManager for fabric materials (synchronous)
          // Pass isTwoTone flag based on global seatType, not individual part pattern
          const isTwoTone = seatType === 'two-tone';
          
          // In two-tone mode, disable stitching for all parts that don't have custom patterns
          const hasCustomPattern = !!meshCustomization.patternId;
          const noStitching = (finalPatternId === 'default' || !finalPatternId) || (isTwoTone && !hasCustomPattern);
          
          child.material = ShaderManager.createMaterial(
            finalFabricType, 
            finalFabricColor, 
            finalStitchColor, 
            texturesRef.current,
            ambientStrength,
            isTwoTone,
            noStitching
          );
          
          materialsRef.current.set(child.name, {
            material: child.material,
            type: finalFabricType,
            fabricColor: finalFabricColor,
            stitchColor: finalStitchColor,
            patternId: finalPatternId,
            ambientStrength: ambientStrength
          });
          
          // Apply per-part pattern if it differs from global pattern
          if (finalPatternId && finalPatternId !== patternId) {
            const patternPromise = ShaderManager.updateMaterial(
              child.material,
              finalFabricType,
              null,
              null,
              finalPatternId,
              originalTexturesRef.current,
              null,
              modelId
            ).catch(err => console.warn(`Failed to apply pattern ${finalPatternId} to ${child.name}:`, err));
            
            patternUpdatePromises.push(patternPromise);
          }
        }
        
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene, texturesLoaded, fabricColor, stitchColor, fabricType, modelId, ambientStrength, materialConfigs, seatParts, seatType]);
  // Note: meshCustomizations and patternId removed from deps to prevent full material rebuild
  // Pattern changes are handled via updateMaterial in the dynamic update effect below
  // seatType changes trigger material recreation to update UV mapping

  // Update uIsTwoTone uniform based on mesh customizations
  // This is handled AFTER pattern updates in the dynamic update effect below
  // to avoid flickering during texture loading

// Handle dynamic material updates (uniforms only - no material recreation)
  useEffect(() => {
    if (!texturesLoaded || !materialsRef.current.size) return;
    
    const updateMaterials = async () => {
      const updatePromises = [];
      
      materialsRef.current.forEach((materialData, meshName) => {
        const meshCustomization = meshCustomizations[meshName] || {};
        let newFabricColor = meshCustomization.fabricColor || fabricColor;
        const newStitchColor = meshCustomization.stitchColor || stitchColor;
        // In two-tone mode, don't apply global pattern to uncustomized parts
        const newPatternId = meshCustomization.patternId || (seatType === 'two-tone' ? null : patternId);
        
        // For piping parts, use stitch color instead of fabric color
        if (materialData.type === 'piping') {
          newFabricColor = newStitchColor;
        }
        
        // Check if colors, pattern, or ambient strength changed to avoid unnecessary updates
        const fabricChanged = materialData.fabricColor !== newFabricColor;
        const stitchChanged = materialData.stitchColor !== newStitchColor;
        
        // Pattern changed only if there's a meaningful change (not undefined/null/default transitions)
        const oldPattern = materialData.patternId || 'default';
        const newPattern = newPatternId || 'default';
        const patternChanged = oldPattern !== newPattern;
        
        const ambientChanged = materialData.ambientStrength !== ambientStrength;
        
        // Determine if stitching should be disabled
        // Disable stitching when: no pattern is selected (patternId is null/undefined/default)
        // OR when in two-tone mode and this part doesn't have a custom pattern
        const isCustomizablePart = customizableParts.includes(meshName);
        const hasNoPattern = !newPatternId || newPatternId === 'default';
        const shouldDisableStitching = hasNoPattern || (seatType === 'two-tone' && isCustomizablePart && !meshCustomization.patternId);
        const noStitchingChanged = materialData.material?.uniforms?.uNoStitching?.value !== shouldDisableStitching;
        
        if (fabricChanged || stitchChanged || patternChanged || ambientChanged || noStitchingChanged) {
          if (materialData.type === 'standard') {
            // Update standard PBR material
            if (fabricChanged) {
              materialData.material.color.set(newFabricColor);
              materialData.fabricColor = newFabricColor;
            }
          } else if (materialData.type === 'piping') {
            // Update piping material (simple standard material)
            if (fabricChanged || stitchChanged) {
              materialData.material.color.set(newFabricColor);
              materialData.fabricColor = newFabricColor;
              materialData.stitchColor = newStitchColor;
            }
          } else {
            // Update shader material using ShaderManager (now supports patterns and ambient)
            // IMPORTANT: For pattern changes, pass the ACTUAL patternId, not null
            const updatePromise = ShaderManager.updateMaterial(
              materialData.material, 
              materialData.type, 
              fabricChanged ? newFabricColor : null, 
              stitchChanged ? newStitchColor : null,
              patternChanged ? newPatternId : null, // Only update pattern texture if changed
              originalTexturesRef.current, // Pass original textures for default pattern
              ambientChanged ? ambientStrength : null,
              modelId // Pass modelId for stitching updates
            ).then(() => {
              // Update tracked values AFTER successful update
              if (fabricChanged) materialData.fabricColor = newFabricColor;
              if (stitchChanged) materialData.stitchColor = newStitchColor;
              if (patternChanged) materialData.patternId = newPatternId;
              if (ambientChanged) materialData.ambientStrength = ambientStrength;
              
              // Update uNoStitching uniform if needed (when switching to two-tone or pattern changes)
              if (noStitchingChanged || patternChanged) {
                const newNoStitching = !newPatternId || newPatternId === 'default' || (seatType === 'two-tone' && isCustomizablePart && !meshCustomization.patternId);
                if (materialData.material.uniforms && materialData.material.uniforms.uNoStitching) {
                  materialData.material.uniforms.uNoStitching.value = newNoStitching;
                  materialData.material.uniformsNeedUpdate = true;
                }
              }
              
              // Update uIsTwoTone uniform based on global seatType
              const isTwoTone = seatType === 'two-tone';
              if (materialData.material.uniforms && materialData.material.uniforms.uIsTwoTone) {
                materialData.material.uniforms.uIsTwoTone.value = isTwoTone;
                materialData.material.uniformsNeedUpdate = true;
              }
            }).catch((err) => {
              console.error(`❌ Failed to update ${meshName}:`, err);
            });
            
            updatePromises.push(updatePromise);
          }
        }
      });
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
    };
    
    updateMaterials();
  }, [texturesLoaded, fabricColor, stitchColor, meshCustomizations, patternId, ambientStrength, seatType, customizableParts, modelId]);

// Handle mesh highlighting
  useEffect(() => {
    if (highlightedMesh && materialsRef.current.has(highlightedMesh)) {
      const materialData = materialsRef.current.get(highlightedMesh);
      
      // Store original material if not already stored
      if (!materialData.originalMaterial) {
        materialData.originalMaterial = materialData.material;
      }
      
      // Create highlighting material
      const highlightMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x00ff00),
        emissive: new THREE.Color(0x004400),
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8
      });
      
      // Apply highlight to mesh
      if (scene) {
        scene.traverse((child) => {
          if (child.isMesh && child.name === highlightedMesh) {
            child.material = highlightMaterial;
          }
        });
      }
    }
    
    // Cleanup - restore original material
    return () => {
      if (highlightedMesh && materialsRef.current.has(highlightedMesh)) {
        const materialData = materialsRef.current.get(highlightedMesh);
        if (materialData.originalMaterial && scene) {
          scene.traverse((child) => {
            if (child.isMesh && child.name === highlightedMesh) {
              child.material = materialData.originalMaterial;
            }
          });
        }
      }
    };
  }, [highlightedMesh, scene]);

  // Handle glow effect on editable parts when invalid click happens
  useEffect(() => {
    if (!glowEditableParts || !scene) return;

    const glowMaterials = new Map();
    const pulseIntervals = [];
    
    // Store original materials and create glow materials
    scene.traverse((child) => {
      if (child.isMesh && customizableParts.includes(child.name)) {
        // Store original material
        if (!originalMaterialsRef.current.has(child.name)) {
          originalMaterialsRef.current.set(child.name, child.material);
        }
        
        // Create glow material with reduced brightness
        const glowMaterial = new THREE.MeshStandardMaterial({
          color: child.material.color || new THREE.Color(0xffffff),
          emissive: new THREE.Color(0xccaa00), // Less bright yellow
          emissiveIntensity: 0.25, // Reduced from 0.6 to 0.25
          transparent: true,
          opacity: 0.9
        });
        
        glowMaterials.set(child.name, glowMaterial);
      }
    });
    
    // Pulse effect - 3 times with 300ms intervals (show glow, hide, show, hide, show, hide)
    let pulseCount = 0;
    const pulseInterval = setInterval(() => {
      scene.traverse((child) => {
        if (child.isMesh && customizableParts.includes(child.name)) {
          // Even count = show glow, odd count = hide
          if (pulseCount % 2 === 0) {
            // Apply glow
            child.material = glowMaterials.get(child.name);
          } else {
            // Apply normal material
            child.material = originalMaterialsRef.current.get(child.name);
          }
        }
      });
      pulseCount++;
      
      // Stop after 6 pulses (3 complete on/off cycles)
      if (pulseCount >= 6) {
        clearInterval(pulseInterval);
      }
    }, 300);
    
    pulseIntervals.push(pulseInterval);

    // Cleanup - restore original materials after animation and clear intervals
    const cleanup = setTimeout(() => {
      // Clear all pulse intervals
      pulseIntervals.forEach(interval => clearInterval(interval));
      
      // Restore original materials
      scene.traverse((child) => {
        if (child.isMesh && originalMaterialsRef.current.has(child.name)) {
          child.material = originalMaterialsRef.current.get(child.name);
        }
      });
      
      // Clean up glow materials
      glowMaterials.forEach(material => material.dispose());
    }, 1800); // 6 pulses * 300ms = 1800ms

    // Cleanup function
    return () => {
      clearTimeout(cleanup);
      pulseIntervals.forEach(interval => clearInterval(interval));
      glowMaterials.forEach(material => material.dispose());
    };
  }, [glowEditableParts, scene, customizableParts]);

  // Track click vs drag state
  const clickStartRef = useRef(null);
  const hoveredObjectRef = useRef(null);
  
  // Handle pointer move to track which object is being hovered
  const handlePointerMove = (event) => {
    if (seatType !== 'two-tone') return;
    hoveredObjectRef.current = event.object;
  };
  
  // Handle pointer down events
  const handlePointerDown = (event) => {
    // Only handle left-clicks in two-tone mode
    if (event.button !== 0 || seatType !== 'two-tone') return;
    
    // Get the first intersected object (closest to camera)
    // event.intersections contains all hit objects, ordered by distance
    let clickedObject = event.object;
    
    // If we have intersections array, get the first valid mesh
    if (event.intersections && event.intersections.length > 0) {
      // Find the first mesh that is in customizable parts
      for (let i = 0; i < event.intersections.length; i++) {
        const intersection = event.intersections[i];
        if (intersection.object && intersection.object.isMesh) {
          clickedObject = intersection.object;
          break; // Take the first (closest) one
        }
      }
    }
    
    console.log('🖱️ PointerDown - Object:', clickedObject?.name, 'Intersections count:', event.intersections?.length || 0);
    
    // Store click start position, time, and object to differentiate from drag
    clickStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      time: Date.now(),
      object: clickedObject
    };
  };
  
  // Handle pointer up events (actual click detection)
  const handlePointerUp = (event) => {
    if (!clickStartRef.current || seatType !== 'two-tone' || !onPartRightClick) return;
    
    const clickStart = clickStartRef.current;
    const clickEnd = {
      x: event.clientX,
      y: event.clientY,
      time: Date.now()
    };
    
    // Calculate distance and time to determine if this was a click vs drag
    const distance = Math.sqrt(
      Math.pow(clickEnd.x - clickStart.x, 2) + 
      Math.pow(clickEnd.y - clickStart.y, 2)
    );
    const duration = clickEnd.time - clickStart.time;
    
    console.log('📊 Click analysis:', { distance, duration, object: clickStart.object?.name });
    
    // Consider it a click if: distance < 50px AND duration < 1000ms (more lenient)
    if (distance < 50 && duration < 1000) {
      event.stopPropagation();
      
      // Use the object from pointer down (most reliable)
      const clickedObject = clickStart.object;
      
      console.log('🖱️ Click VALID - detected on:', clickedObject?.name);
      console.log('📋 Customizable parts list:', customizableParts);
      console.log('🔍 Is in list?', clickedObject ? customizableParts.includes(clickedObject.name) : false);
      
      if (clickedObject && customizableParts.includes(clickedObject.name)) {
        // Valid part clicked - trigger application
        console.log('✅ APPLYING - Valid part clicked:', clickedObject.name);
        onPartRightClick(clickedObject.name, null, true);
      } else {
        // Invalid part clicked - show warning and highlight valid parts
        console.log('❌ INVALID - Invalid part clicked:', clickedObject?.name || 'unknown', 'Object exists?', !!clickedObject);
        onPartRightClick(null, null, false);
      }
    } else {
      console.log('⚠️ Click IGNORED - distance:', distance, 'duration:', duration);
    }
    
    // Clear click start reference
    clickStartRef.current = null;
  };

  return (
    scene && (
      <primitive
        ref={meshRef}
        object={scene}
        scale={modelConfig?.scale || [1, 1, 1]}
        position={modelConfig?.position || [0.5, 0, 0]}
        rotation={modelConfig?.rotation || [0, 0, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    )
  );
}

// Preload both models for better performance
useGLTF.preload('/assets/models/1/chair1_v03.glb');
useGLTF.preload('/assets/models/2/chair1_v03.glb');

export default Model3D;
