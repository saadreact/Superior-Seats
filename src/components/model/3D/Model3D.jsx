import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { getModelConfig } from '../config/assets';
import { ShaderManager } from '../shaders/ShaderManager';

function Model3D({ 
  modelId = '1', // New prop for model selection
  stitchColor = '#ffffff',
  fabricColor = '#ffffff',
  fabricType = 'leather',
  meshCustomizations = {}, // Individual mesh customizations
  highlightedMesh = null, // Mesh name to highlight
  patternId = null, // Pattern ID for dynamic pattern loading
  ambientStrength = 0.5, // Ambient lighting strength from environment
  onPartRightClick = null, // Right-click handler for parts
  seatType = 'single' // Seat type (single or two-tone)
}) {
  const meshRef = useRef();
  const materialsRef = useRef(new Map()); // Track materials for updates
  const originalTexturesRef = useRef(null); // Store original textures for default pattern
  
  // Get model configuration dynamically based on modelId
  const modelConfig = useMemo(() => getModelConfig(modelId), [modelId]);
  
  // Load GLTF model and base textures dynamically based on modelId
  const { scene } = useGLTF(modelConfig.model);
  
  // Determine diamond normal texture path based on pattern selection
  const getDiamondNormalPath = () => {
    if (patternId && patternId !== 'default') {
      // Extract pattern info to determine correct path
      const [modelNum, patternNum] = patternId.split('-');
      if (patternNum === '1') {
        return `/assets/patterns/${modelNum}/1.jpg`;
      } else {
        return `/assets/patterns/${modelNum}/0${patternNum}.jpg`;
      }
    }
    return modelConfig.textures.diamondNormal; // Default diamond normal
  };
  
  const textures = useTexture({
    //baseColor: modelConfig.textures.baseColor,
    //normal: modelConfig.textures.normal,
    diamondNormal: getDiamondNormalPath(),
    //roughness: modelConfig.textures.roughness,
    //metallic: modelConfig.textures.metallic,
    ao: modelConfig.textures.ao,
    stitch: modelConfig.textures.stitch,
    //stitch1: modelConfig.textures.stitch1,
    //stitch2: modelConfig.textures.stitch2,
    //brick: modelConfig.textures.brick
  });
  
  // Define which parts can be customized in two-tone mode
  const customizableParts = [
    'seat_bottom_upper',
    'seat_bottom_lower',
    'seat_back_upper',
    'seat_back_lover', // Note: typo in original mesh name
    'headset_front',
    'headset_back',
    'left_arm_upper',
    'right_arm_upper'
  ];
  
  // Define seat part categories for material assignment
  const seatParts = {
    base: ['base', 'seat_bottom', 'seat_bottom_upper', 'seat_bottom_lower'],
    backrest: ['seat_back', 'seat_back_upper', 'seat_back_lover'],
    headrest: ['headset_front', 'headset_back'],
    armrests: ['left_arm_upper', 'left_arm_lover', 'right_arm_upper', 'right_arm_lower'],
    frame: ['bottom_cover']
  };
  
  // Material configurations for different parts
  const materialConfigs = {
    base: { color: fabricColor, fabricType: fabricType, hasStitching: true, name: 'Seat Base' },
    backrest: { color: fabricColor, fabricType: fabricType, hasStitching: true, name: 'Backrest' },
    headrest: { color: fabricColor, fabricType: fabricType, hasStitching: true, name: 'Headrest' },
    armrests: { color: fabricColor, fabricType: fabricType, hasStitching: true, name: 'Armrests' },
    frame: { color: '#333333', fabricType: 'metal', hasStitching: false, name: 'Frame' }
  };
  
  // Helper function to determine part category
  const getPartCategory = (meshName) => {
    for (const [category, meshNames] of Object.entries(seatParts)) {
      if (meshNames.some(name => meshName.includes(name))) {
        return category;
      }
    }
    return 'frame'; // Default fallback
  };
  
  // Configure textures on load and store original textures
  useEffect(() => {
    if (textures) {
      // Store original textures for default pattern restoration
      originalTexturesRef.current = { ...textures };
      
      Object.entries(textures).forEach(([key, texture]) => {
        if (texture && texture.colorSpace !== undefined) {
          texture.colorSpace = (key.includes('baseColor') || key.includes('stitch') || key.includes('brick')) 
            ? THREE.SRGBColorSpace 
            : THREE.NoColorSpace;
          texture.flipY = false;
        }
      });
    }
  }, [textures]);
  
  // Setup material system using ShaderManager
  useEffect(() => {
    if (!scene || !textures.ao) return;
    
    console.log(`🔧 Setting up materials for model ${modelId} with ${fabricType}`);
    let partCounts = {};
    
    scene.traverse((child) => {
      if (child.isMesh) {
        const partCategory = getPartCategory(child.name);
        const config = materialConfigs[partCategory];
        partCounts[partCategory] = (partCounts[partCategory] || 0) + 1;
        
        // Get customizations for this specific mesh
        const meshCustomization = meshCustomizations[child.name] || {};
        let finalFabricColor = meshCustomization.fabricColor || config.color;
        const finalStitchColor = meshCustomization.stitchColor || stitchColor;
        const finalFabricType = meshCustomization.fabricType || config.fabricType;
        const finalPatternId = meshCustomization.patternId || patternId;
        
        // In two-tone mode, darken customizable parts that haven't been customized yet
        const isCustomizablePart = customizableParts.includes(child.name);
        const isCustomized = !!meshCustomization.fabricColor;
        if (seatType === 'two-tone' && isCustomizablePart && !isCustomized) {
          // Darken the color by 20% to indicate it's editable
          const color = new THREE.Color(finalFabricColor);
          color.multiplyScalar(0.8);
          finalFabricColor = '#' + color.getHexString();
        }
        
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
        } else {
          // Use ShaderManager for fabric materials (synchronous)
          child.material = ShaderManager.createMaterial(
            finalFabricType, 
            finalFabricColor, 
            finalStitchColor, 
            textures,
            ambientStrength
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
            ShaderManager.updateMaterial(
              child.material,
              finalFabricType,
              null,
              null,
              finalPatternId,
              originalTexturesRef.current,
              null
            ).catch(err => console.warn(`Failed to apply pattern ${finalPatternId} to ${child.name}:`, err));
          }
        }
        
        child.castShadow = true;
        child.receiveShadow = true;
        
        console.log(`✅ Applied ${config.name} (${finalFabricType}) to: ${child.name}`);
      }
    });
    
    console.log('📊 Parts Summary:', partCounts);
  }, [scene, textures, fabricColor, stitchColor, fabricType, modelId, patternId, ambientStrength, seatType]);
  // Note: meshCustomizations removed from deps to prevent full material rebuild on customization changes
  // Dynamic updates are handled by the separate useEffect below

// Handle dynamic material updates using ShaderManager
  useEffect(() => {
    const updateMaterials = async () => {
      const updatePromises = [];
      
      materialsRef.current.forEach((materialData, meshName) => {
        const meshCustomization = meshCustomizations[meshName] || {};
        let newFabricColor = meshCustomization.fabricColor || fabricColor;
        const newStitchColor = meshCustomization.stitchColor || stitchColor;
        const newPatternId = meshCustomization.patternId || patternId;
        
        // In two-tone mode, darken customizable parts that haven't been customized yet
        const isCustomizablePart = customizableParts.includes(meshName);
        const isCustomized = !!meshCustomization.fabricColor;
        if (seatType === 'two-tone' && isCustomizablePart && !isCustomized) {
          // Darken the color by 20% to indicate it's editable
          const color = new THREE.Color(newFabricColor);
          color.multiplyScalar(0.8);
          newFabricColor = '#' + color.getHexString();
        }
        
        // Check if colors, pattern, or ambient strength changed to avoid unnecessary updates
        const fabricChanged = materialData.fabricColor !== newFabricColor;
        const stitchChanged = materialData.stitchColor !== newStitchColor;
        const patternChanged = materialData.patternId !== newPatternId;
        const ambientChanged = materialData.ambientStrength !== ambientStrength;
        
        if (fabricChanged || stitchChanged || patternChanged || ambientChanged) {
          if (fabricChanged || stitchChanged || patternChanged) {
            console.log(`🔄 Updating ${meshName}:`, {
              fabricChanged: fabricChanged ? `${materialData.fabricColor} → ${newFabricColor}` : false,
              stitchChanged: stitchChanged ? `${materialData.stitchColor} → ${newStitchColor}` : false,
              patternChanged: patternChanged ? `${materialData.patternId} → ${newPatternId}` : false
            });
          }
        
          if (materialData.type === 'standard') {
            // Update standard PBR material
            if (fabricChanged) {
              materialData.material.color.set(newFabricColor);
              materialData.fabricColor = newFabricColor;
            }
          } else {
            // Update shader material using ShaderManager (now supports patterns and ambient)
            const updatePromise = ShaderManager.updateMaterial(
              materialData.material, 
              materialData.type, 
              fabricChanged ? newFabricColor : null, 
              stitchChanged ? newStitchColor : null,
              patternChanged ? newPatternId : null,
              originalTexturesRef.current, // Pass original textures for default pattern
              ambientChanged ? ambientStrength : null
            ).then(() => {
              if (fabricChanged) materialData.fabricColor = newFabricColor;
              if (stitchChanged) materialData.stitchColor = newStitchColor;
              if (patternChanged) materialData.patternId = newPatternId;
              if (ambientChanged) materialData.ambientStrength = ambientStrength;
            });
            
            updatePromises.push(updatePromise);
          }
        }
      });
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
    };
    
    updateMaterials();
  }, [fabricColor, stitchColor, meshCustomizations, patternId, ambientStrength, seatType]);

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

  // Handle click events on meshes
  const handlePointerDown = (event) => {
    // Only handle right-clicks in two-tone mode
    if (event.button !== 2 || seatType !== 'two-tone' || !onPartRightClick) return;
    
    event.stopPropagation();
    
    // Get the clicked object
    const clickedObject = event.object;
    
    // Check if this is a customizable part
    if (clickedObject && customizableParts.includes(clickedObject.name)) {
      // Calculate screen position for popup
      const position = {
        x: event.clientX,
        y: event.clientY
      };
      
      onPartRightClick(clickedObject.name, position);
    }
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
      />
    )
  );
}

// Preload both models for better performance
useGLTF.preload('/assets/models/1/chair1_v03.glb');
useGLTF.preload('/assets/models/2/chair1_v03.glb');

export default Model3D;
