import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getModelConfig, getStitchingPath } from '../../config/assets';
import { ShaderManager } from '../../shaders/ShaderManager';
import { TextureManager } from '../../utils/TextureManager';

function Model3D({
  modelFileUrl, // New prop for dynamic model loading
  modelId = '1',
  stitchColor = '#ffffff',
  fabricColor = '#ffffff',
  fabricType = 'leather',
  meshCustomizations = {}, // Individual mesh customizations
  highlightedMesh = null, // Mesh name to highlight
  patternId = null, // Pattern ID for dynamic pattern loading
  ambientStrength = 0.5, // Ambient lighting strength from environment
  onPartRightClick = null, // Left-click handler for parts in two-tone mode
  seatType = 'single', // Seat type (single or two-tone)
  glowEditableParts = false, // Trigger glow effect on editable parts
  onLoadComplete = null // Callback when model finishes loading
}) {
  const meshRef = useRef();
  const materialsRef = useRef(new Map()); // Track materials for updates
  const originalTexturesRef = useRef(null); // Store original textures for default pattern
  const originalMaterialsRef = useRef(new Map()); // Store original materials for glow effect
  const texturesRef = useRef(null); // Store loaded textures
  const [texturesLoaded, setTexturesLoaded] = useState(false); // Track texture loading state
  const prevMeshCustomizationsRef = useRef(JSON.stringify(meshCustomizations)); // Track previous meshCustomizations to prevent infinite loops

  // Get model configuration dynamically based on modelId
  const modelConfig = useMemo(() => getModelConfig(modelId), [modelId]);

  // State to track the actual model path to use (with fallback support)
  // Initialize with static asset (fallback), will switch to API URL if it exists
  const [actualModelPath, setActualModelPath] = useState(modelConfig.model);

  // Determine model path: try API URL first, fallback to static asset if it fails
  useEffect(() => {
    const determineModelPath = async () => {
      // If no API URL provided, use static asset directly
      if (!modelFileUrl) {
        setActualModelPath(modelConfig.model);
        return;
      }

      // Try to verify API URL exists by fetching it
      try {
        const response = await fetch(modelFileUrl, { method: 'HEAD' });
        if (response.ok) {
          // API file exists, use it
          setActualModelPath(modelFileUrl);
        } else {
          // API file doesn't exist (404), use static asset fallback
          console.warn(`⚠️ API model file not found (${response.status}): ${modelFileUrl}. Using fallback: ${modelConfig.model}`);
          setActualModelPath(modelConfig.model);
        }
      } catch (error) {
        // Network error or CORS issue, use static asset fallback
        console.warn(`⚠️ Failed to verify API model file: ${modelFileUrl}. Error: ${error.message}. Using fallback: ${modelConfig.model}`);
        setActualModelPath(modelConfig.model);
      }
    };

    determineModelPath();
  }, [modelFileUrl, modelConfig.model]);

  // Use the determined model path (starts with fallback, switches to API if available)
  const modelPath = actualModelPath;

  // Load GLTF model and base textures dynamically
  // Always call useGLTF (hooks must be called unconditionally)
  // If actualModelPath is null initially, use the fallback path
  const { scene } = useGLTF(modelPath);

  // Memoize texture paths to prevent unnecessary reloads
  // In two-tone mode, always use default textures (no global pattern)
  // patternId format: "modelId-patternNum" (e.g., "1-2" from static_pattern_id)
  const diamondNormalPath = useMemo(() => {
    // In two-tone mode, don't use global pattern for base textures
    const effectivePatternId = seatType === 'two-tone' ? null : patternId;

    if (effectivePatternId && effectivePatternId !== 'default') {
      // Extract pattern info from static_pattern_id format: "modelId-patternNum"
      // e.g., "1-2" → modelNum="1", patternNum="2" → /assets/patterns/1/02.jpg
      const [modelNum, patternNum] = effectivePatternId.split('-');
      if (patternNum && modelNum) {
        if (patternNum === '1') {
          return `/assets/patterns/${modelNum}/1.jpg`;
        } else {
          return `/assets/patterns/${modelNum}/0${patternNum}.jpg`;
        }
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

  // Notify parent when model and textures are fully loaded
  useEffect(() => {
    if (scene && texturesLoaded && onLoadComplete) {
      // Small delay to ensure everything is rendered
      const timer = setTimeout(() => {
        onLoadComplete();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [scene, texturesLoaded, onLoadComplete]);

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
    base: { hasStitching: true, name: 'Seat Base', useFabricColor: true },
    backrest: { hasStitching: true, name: 'Backrest', useFabricColor: true },
    headrest: { hasStitching: true, name: 'Headrest', useFabricColor: true },
    armrests: { hasStitching: true, name: 'Armrests', useFabricColor: true },
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

    let partCounts = {};
    const patternUpdatePromises = [];
    const allMeshNames = [];

    // Async function to create materials
    const setupMaterials = async () => {
      const materialPromises = [];

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
            // Use ShaderManager for fabric materials (now async)
            // Pass isTwoTone flag based on global seatType, not individual part pattern
            const isTwoTone = seatType === 'two-tone';

            // In two-tone mode, disable stitching for all parts that don't have custom patterns
            const hasCustomPattern = !!meshCustomization.patternId;
            const noStitching = (finalPatternId === 'default' || !finalPatternId) || (isTwoTone && !hasCustomPattern);

            const materialPromise = ShaderManager.createMaterial(
              finalFabricType,
              finalFabricColor,
              finalStitchColor,
              texturesRef.current,
              ambientStrength,
              isTwoTone,
              noStitching
            ).then(material => {
              child.material = material;

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
                return ShaderManager.updateMaterial(
                  child.material,
                  finalFabricType,
                  null,
                  null,
                  finalPatternId,
                  originalTexturesRef.current,
                  null,
                  modelId
                ).catch(err => console.warn(`Failed to apply pattern ${finalPatternId} to ${child.name}:`, err));
              }
            }).catch(err => console.error(`Failed to create material for ${child.name}:`, err));

            materialPromises.push(materialPromise);
          }

          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Wait for all materials to be created
      await Promise.all(materialPromises);
    };

    setupMaterials();
  }, [scene, texturesLoaded, fabricColor, stitchColor, fabricType, modelId, ambientStrength, seatType]);
  // Note: materialConfigs and seatParts are memoized with empty deps, so they're stable and don't need to be in deps
  // Note: meshCustomizations and patternId removed from deps to prevent full material rebuild
  // Pattern changes are handled via updateMaterial in the dynamic update effect below
  // seatType changes trigger material recreation to update UV mapping

  // Update uIsTwoTone uniform based on mesh customizations
  // This is handled AFTER pattern updates in the dynamic update effect below
  // to avoid flickering during texture loading

  // Track previous patternId to detect changes
  const prevPatternIdRef = useRef(patternId);

  // Handle dynamic material updates (uniforms only - no material recreation)
  useEffect(() => {
    if (!texturesLoaded || !materialsRef.current.size) return;

    // Check if meshCustomizations actually changed (deep comparison via JSON.stringify)
    const currentMeshCustomizationsStr = JSON.stringify(meshCustomizations);
    const meshCustomizationsChanged = currentMeshCustomizationsStr !== prevMeshCustomizationsRef.current;
    const patternIdChanged = prevPatternIdRef.current !== patternId;
    
    // If neither meshCustomizations nor patternId changed, skip update to prevent infinite loop
    if (!meshCustomizationsChanged && !patternIdChanged) {
      return;
    }
    
    // Update refs
    prevMeshCustomizationsRef.current = currentMeshCustomizationsStr;
    prevPatternIdRef.current = patternId;

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
          newFabricColor = newStitchColor; // important 
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
  // Note: meshCustomizations is in deps but we use a ref check inside to prevent infinite loops from object recreation

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
    if (!glowEditableParts || !scene) {
      // Ensure materials are restored when glow is disabled
      if (!glowEditableParts && scene) {
        scene.traverse((child) => {
          if (child.isMesh && customizableParts.includes(child.name)) {
            // Get the current material from materialsRef (the actual material being used)
            const materialData = materialsRef.current.get(child.name);
            if (materialData && materialData.material) {
              child.material = materialData.material;
            }
          }
        });
      }
      return;
    }

    const glowMaterials = new Map();
    const pulseIntervals = [];
    const originalMaterialsMap = new Map(); // Store materials at glow start

    // Store original materials and create glow materials
    scene.traverse((child) => {
      if (child.isMesh && customizableParts.includes(child.name)) {
        // Get the ACTUAL current material from materialsRef, not from child.material
        // This ensures we restore to the correct material even if it was changed
        const materialData = materialsRef.current.get(child.name);
        const currentMaterial = materialData ? materialData.material : child.material;
        
        // Store the current material
        originalMaterialsMap.set(child.name, currentMaterial);

        // Create glow material with reduced brightness
        const glowMaterial = new THREE.MeshStandardMaterial({
          color: currentMaterial.color || new THREE.Color(0xffffff),
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
            // Apply normal material from our stored map
            child.material = originalMaterialsMap.get(child.name);
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

      // Restore original materials from materialsRef (the actual current materials)
      scene.traverse((child) => {
        if (child.isMesh && customizableParts.includes(child.name)) {
          const materialData = materialsRef.current.get(child.name);
          if (materialData && materialData.material) {
            child.material = materialData.material;
          } else if (originalMaterialsMap.has(child.name)) {
            child.material = originalMaterialsMap.get(child.name);
          }
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
      
      // Ensure materials are restored on unmount or when glowEditableParts changes
      scene.traverse((child) => {
        if (child.isMesh && customizableParts.includes(child.name)) {
          const materialData = materialsRef.current.get(child.name);
          if (materialData && materialData.material) {
            child.material = materialData.material;
          }
        }
      });
    };
  }, [glowEditableParts, scene, customizableParts]);

  // Track click vs drag state
  const clickStartRef = useRef(null);
  const hoveredObjectRef = useRef(null);
  const { raycaster, camera, gl } = useThree();
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Handle pointer move to track which object is being hovered (kept for potential future hover effects)
  const handlePointerMove = (event) => {
    if (seatType !== 'two-tone') return;
    hoveredObjectRef.current = event.object;
  };

  // Track mouse down/up to differentiate clicks from drags
  const mouseDownRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Manual click detection using raycaster (differentiates clicks from drags)
  useEffect(() => {
    if (seatType !== 'two-tone' || !onPartRightClick || !scene) return;

    const handleMouseDown = (event) => {
      // Only track left mouse button
      if (event.button !== 0) return;
      
      mouseDownRef.current = {
        x: event.clientX,
        y: event.clientY,
        time: Date.now()
      };
      isDraggingRef.current = false;
    };

    const handleMouseMove = (event) => {
      if (!mouseDownRef.current) return;
      
      // Check if mouse moved significantly (more than 5px = drag)
      const distance = Math.sqrt(
        Math.pow(event.clientX - mouseDownRef.current.x, 2) +
        Math.pow(event.clientY - mouseDownRef.current.y, 2)
      );
      
      if (distance > 5) {
        isDraggingRef.current = true;
      }
    };

    // Handle mouse leaving canvas - reset tracking to prevent stuck state
    const handleMouseLeave = () => {
      if (mouseDownRef.current) {
        mouseDownRef.current = null;
        isDraggingRef.current = false;
      }
    };

    const handleMouseUp = (event) => {
      // Only handle left mouse button
      if (event.button !== 0 || !mouseDownRef.current) {
        mouseDownRef.current = null;
        isDraggingRef.current = false;
        return;
      }

      const mouseDown = mouseDownRef.current;
      const mouseUp = {
        x: event.clientX,
        y: event.clientY,
        time: Date.now()
      };

      // Calculate distance and duration
      const distance = Math.sqrt(
        Math.pow(mouseUp.x - mouseDown.x, 2) +
        Math.pow(mouseUp.y - mouseDown.y, 2)
      );
      const duration = mouseUp.time - mouseDown.time;

      // Only treat as click if: distance < 5px AND duration < 300ms AND not dragging
      const isClick = distance < 5 && duration < 300 && !isDraggingRef.current;

      if (isClick && seatType === 'two-tone' && onPartRightClick) {

        // Stop OrbitControls from handling this click
        event.stopPropagation();
        event.preventDefault();

        // Calculate mouse position in normalized device coordinates (-1 to +1)
        const rect = gl.domElement.getBoundingClientRect();
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Update raycaster with camera and mouse position
        raycasterRef.current.setFromCamera(mouseRef.current, camera);

        // Optimize: Only check customizable parts instead of entire scene
        // Create a group of only customizable meshes for faster intersection
        let intersects = [];
        scene.traverse((child) => {
          if (child.isMesh && customizableParts.includes(child.name)) {
            const childIntersects = raycasterRef.current.intersectObject(child, false);
            if (childIntersects.length > 0) {
              intersects.push(...childIntersects);
            }
          }
        });
        
        // Sort by distance (closest first)
        intersects.sort((a, b) => a.distance - b.distance);
        
        if (intersects.length > 0) {
          // Get the closest intersection (already sorted)
          const intersection = intersects[0];
          const meshName = intersection.object.name;
          const clickPosition = {
            x: event.clientX,
            y: event.clientY
          };
          onPartRightClick(meshName, clickPosition, true);
          mouseDownRef.current = null;
          isDraggingRef.current = false;
          return;
        } else {
          // No valid part found
          console.warn('⚠️ Clicked object not in customizable parts');
          onPartRightClick(null, null, false);
        }
      } else {
        // console.log('🚫 Ignored - was a drag:', { distance, duration, isDragging: isDraggingRef.current });
      }

      // Reset tracking
      mouseDownRef.current = null;
      isDraggingRef.current = false;
    };

    // Use capture phase to intercept before OrbitControls
    gl.domElement.addEventListener('mousedown', handleMouseDown, true);
    gl.domElement.addEventListener('mousemove', handleMouseMove, true);
    gl.domElement.addEventListener('mouseup', handleMouseUp, true);
    gl.domElement.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown, true);
      gl.domElement.removeEventListener('mousemove', handleMouseMove, true);
      gl.domElement.removeEventListener('mouseup', handleMouseUp, true);
      gl.domElement.removeEventListener('mouseleave', handleMouseLeave, true);
      // Reset refs on cleanup
      mouseDownRef.current = null;
      isDraggingRef.current = false;
    };
  }, [seatType, onPartRightClick, scene, camera, gl, customizableParts]);

  // NOTE: handlePointerDown and handlePointerUp are kept for potential future use
  // but are currently not attached to the primitive since we use raycaster-based detection
  // They can be removed if not needed, but keeping for reference

  // Only render if scene is loaded
  if (!scene) {
    return null;
  }

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={modelConfig?.scale || [1, 1, 1]}
      position={modelConfig?.position || [0.5, 0, 0]}
      rotation={modelConfig?.rotation || [0, 0, 0]}
      onPointerMove={handlePointerMove}
      // Note: Click detection is handled via raycaster in useEffect above
      // to properly differentiate clicks from drags and work with OrbitControls
    />
  );
}

// Preloads removed to support dynamic loading
// useGLTF.preload('/assets/models/1/chair1_v03.glb');
// useGLTF.preload('/assets/models/2/chair1_v03.glb');

export default Model3D;
