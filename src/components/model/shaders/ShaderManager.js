import { createLeatherMaterial, updateLeatherUniforms } from './LeatherMaterial';
import { createClothMaterial, updateClothUniforms } from './ClothMaterial';
import { createSuedeMaterial, updateSuedeUniforms } from './SuedeMaterial';
import { createVinylMaterial, updateVinylUniforms } from './VinylMaterial';
import { createMeshMaterial, updateMeshUniforms } from './MeshMaterial';
import { createCarbonFiberMaterial, updateCarbonFiberUniforms } from './CarbonFiberMaterial';
import { createMiamiVinylMaterial, updateMiamiVinylUniforms } from './MiamiVinylMaterial';
import { createUltraleatherMaterial, updateUltraleatherUniforms } from './UltraleatherMaterial';
import { createBrisaDistressedMaterial, updateBrisaDistressedUniforms } from './BrisaDistressedMaterial';
import { createCarrollLeatherMaterial, updateCarrollLeatherUniforms } from './CarrollLeatherMaterial';
import { patternLoader } from '../utils/PatternLoader';
import { getStitchingPath } from '../config/assets';
import * as THREE from 'three';

/**
 * Central shader manager for all fabric types
 * Handles creation and updates of different fabric shaders with dynamic patterns
 */
export class ShaderManager {
  static copySamplerSettings(targetTex, sourceTex) {
    if (!targetTex || !sourceTex) return;
    targetTex.wrapS = sourceTex.wrapS;
    targetTex.wrapT = sourceTex.wrapT;
    targetTex.magFilter = sourceTex.magFilter;
    targetTex.minFilter = sourceTex.minFilter;
    targetTex.anisotropy = sourceTex.anisotropy || targetTex.anisotropy;
    targetTex.offset.copy(sourceTex.offset);
    targetTex.repeat.copy(sourceTex.repeat);
    
    targetTex.center?.copy?.(sourceTex.center || { x: 0, y: 0 });
    targetTex.rotation = sourceTex.rotation || 0;
    // Ensure flipY matches how other textures are configured
    targetTex.flipY = sourceTex.flipY;
    // Match color space/encoding
    if (targetTex.colorSpace !== undefined && sourceTex.colorSpace !== undefined) {
      targetTex.colorSpace = sourceTex.colorSpace;
    }
    targetTex.needsUpdate = true;
  }
  static fabricTypes = {
    leather: {
      name: 'Premium Leather',
      hasStitching: true,
      createMaterial: createLeatherMaterial,
      updateUniforms: updateLeatherUniforms,
      specularPower: 20.0,
      specularIntensity: 0.4
    },
    cloth: {
      name: 'Fabric Cloth',
      hasStitching: true,
      createMaterial: createClothMaterial,
      updateUniforms: updateClothUniforms,
      specularPower: 6.0,
      specularIntensity: 0.1
    },
    suede: {
      name: 'Suede Material',
      hasStitching: true, // Now supports stitching
      createMaterial: createSuedeMaterial,
      updateUniforms: updateSuedeUniforms,
      specularPower: 8.0,
      specularIntensity: 0.15
    },
    vinyl: {
      name: 'Synthetic Vinyl',
      hasStitching: true,
      createMaterial: createVinylMaterial,
      updateUniforms: updateVinylUniforms,
      specularPower: 32.0,
      specularIntensity: 0.6
    },
    mesh: {
      name: 'Breathable Mesh',
      hasStitching: true, // Now supports stitching (reinforcement threads)
      createMaterial: createMeshMaterial,
      updateUniforms: updateMeshUniforms,
      specularPower: 10.0,
      specularIntensity: 0.2
    },
    carbon: {
      name: 'Carbon Fiber',
      hasStitching: true, // Now supports stitching (binding threads)
      createMaterial: createCarbonFiberMaterial,
      updateUniforms: updateCarbonFiberUniforms,
      specularPower: 48.0,
      specularIntensity: 0.7
    },
    'miami-vinyl': {
      name: 'Miami Vinyl\'s',
      hasStitching: true,
      createMaterial: createMiamiVinylMaterial,
      updateUniforms: updateMiamiVinylUniforms,
      specularPower: 28.0,
      specularIntensity: 0.55
    },
    ultraleather: {
      name: 'Ultraleather',
      hasStitching: true,
      createMaterial: createUltraleatherMaterial,
      updateUniforms: updateUltraleatherUniforms,
      specularPower: 22.0,
      specularIntensity: 0.45
    },
    'brisa-distressed': {
      name: 'Brisa Distressed',
      hasStitching: true,
      createMaterial: createBrisaDistressedMaterial,
      updateUniforms: updateBrisaDistressedUniforms,
      specularPower: 12.0,
      specularIntensity: 0.25
    },
    'carroll-leather': {
      name: 'Carroll Leather',
      hasStitching: true,
      createMaterial: createCarrollLeatherMaterial,
      updateUniforms: updateCarrollLeatherUniforms,
      specularPower: 18.0,
      specularIntensity: 0.35
    },
    // Aliases for new seeder shader_ids
    'ultrafabrics': {
      name: 'Ultrafabrics',
      hasStitching: true,
      createMaterial: createUltraleatherMaterial,
      updateUniforms: updateUltraleatherUniforms,
      specularPower: 22.0,
      specularIntensity: 0.45
    },
    'miami-corp-cloths': {
      name: 'Miami Corp Cloths',
      hasStitching: true,
      createMaterial: createClothMaterial,
      updateUniforms: updateClothUniforms,
      specularPower: 6.0,
      specularIntensity: 0.1
    }
  };

  /**
   * Create a material for a specific fabric type
   * @param {string} fabricType - The fabric type (leather, cloth, etc.)
   * @param {string} fabricColor - Hex color for the fabric
   * @param {string} stitchColor - Hex color for stitching (if applicable)
   * @param {object} textures - Texture objects
   * @param {number} ambientStrength - Ambient lighting strength (0.0 to 1.0)
   * @param {boolean} isTwoTone - Whether we're in two-tone mode (affects UV mapping)
   * @param {boolean} noStitching - Whether to disable stitching for this material
   * @returns {THREE.Material} The created material
   */
  static createMaterial(fabricType, fabricColor, stitchColor, textures, ambientStrength = 0.5, isTwoTone = false, noStitching = false) {
    const fabricConfig = this.fabricTypes[fabricType];
    
    if (!fabricConfig) {
      console.warn(`Unknown fabric type: ${fabricType}, falling back to leather`);
      fabricType = 'leather';
    }

    const finalFabricConfig = this.fabricTypes[fabricType];
    const specularPower = finalFabricConfig.specularPower || 20.0;
    const specularIntensity = finalFabricConfig.specularIntensity || 0.4;
    
    // Create material based on type with material-specific specular properties
    if (finalFabricConfig.hasStitching) {
      return finalFabricConfig.createMaterial(fabricColor, stitchColor, textures, ambientStrength, specularPower, specularIntensity, isTwoTone, noStitching);
    } else {
      return finalFabricConfig.createMaterial(fabricColor, textures, ambientStrength, specularPower, specularIntensity, isTwoTone, noStitching);
    }
  }

  /**
   * Update material uniforms dynamically
   * @param {THREE.Material} material - The material to update
   * @param {string} fabricType - The fabric type
   * @param {string} fabricColor - New fabric color
   * @param {string} stitchColor - New stitch color (if applicable)
   * @param {string} patternId - New pattern ID (if applicable)
   * @param {object} originalTextures - Original textures for default pattern restoration
   * @param {number} ambientStrength - Ambient lighting strength (0.0 to 1.0)
   * @param {string} modelId - Model ID for loading pattern-specific stitching
   */
  static async updateMaterial(material, fabricType, fabricColor, stitchColor, patternId = null, originalTextures = null, ambientStrength = null, modelId = '1') {
    const fabricConfig = this.fabricTypes[fabricType];
    
    if (!fabricConfig) {
      console.warn(`Unknown fabric type for update: ${fabricType}`);
      return;
    }

    // Update pattern if specified (including handling 'default' pattern)
    if (patternId !== null && material.uniforms && material.uniforms.diamondNormalMap) {
      try {
        let patternTexture = null;
        if (patternId === 'default') {
          // Restore original diamond normal texture
          patternTexture = originalTextures?.diamondNormal || material.uniforms.diamondNormalMap.value;
        } else {
          patternTexture = await patternLoader.createPatternTexture(patternId);
        }

        // Copy sampler settings from existing diamond map if available
        const currentTex = material.uniforms.diamondNormalMap.value;
        if (patternTexture && currentTex) {
          this.copySamplerSettings(patternTexture, currentTex);
          
        }

        material.uniforms.diamondNormalMap.value = patternTexture;
        material.needsUpdate = true;
        
        // Update stitching texture when pattern changes (each pattern has its own stitching)
        if (material.uniforms.stitchMap && fabricConfig.hasStitching) {
          try {
            const stitchingPath = getStitchingPath(modelId, patternId);
            const currentStitchTex = material.uniforms.stitchMap.value;
            
            const textureLoader = new THREE.TextureLoader();
            const newStitchTexture = await new Promise((resolve, reject) => {
              const texture = textureLoader.load(
                stitchingPath,
                (loadedTexture) => {
                  loadedTexture.needsUpdate = true;
                  resolve(loadedTexture);
                },
                undefined,
                (error) => {
                  console.warn(`Failed to load stitching texture ${stitchingPath}:`, error);
                  reject(error);
                }
              );
              
              // Set properties immediately on the texture object (before it finishes loading)
              // This is critical - flipY must be set BEFORE the texture is processed
              texture.flipY = false;
              texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
              texture.colorSpace = THREE.SRGBColorSpace;
              
              // Copy additional settings from current stitch texture if available
              if (currentStitchTex) {
                texture.offset.copy(currentStitchTex.offset);
                texture.repeat.copy(currentStitchTex.repeat);
                if (currentStitchTex.center) texture.center.copy(currentStitchTex.center);
                texture.rotation = currentStitchTex.rotation || 0;
              }
            });
            
            // Update the stitching texture uniform
            material.uniforms.stitchMap.value = newStitchTexture;
          } catch (error) {
            console.warn(`Failed to update stitching for pattern ${patternId}:`, error);
          }
        }
      } catch (error) {
        console.warn(`Failed to update pattern ${patternId}:`, error);
      }
    }

    // Get material-specific specular properties (if updating dynamically)
    const specularPower = fabricConfig.specularPower || null;
    const specularIntensity = fabricConfig.specularIntensity || null;
    
    // Update material colors and properties based on type
    if (fabricConfig.hasStitching) {
      fabricConfig.updateUniforms(material, fabricColor, stitchColor, ambientStrength, specularPower, specularIntensity);
    } else {
      fabricConfig.updateUniforms(material, fabricColor, ambientStrength, specularPower, specularIntensity);
    }
  }

  /**
   * Get fabric type configuration
   * @param {string} fabricType - The fabric type
   * @returns {object} Fabric configuration
   */
  static getFabricConfig(fabricType) {
    return this.fabricTypes[fabricType] || this.fabricTypes.leather;
  }

  /**
   * Check if fabric type supports stitching
   * @param {string} fabricType - The fabric type
   * @returns {boolean} Whether stitching is supported
   */
  static hasStitching(fabricType) {
    const config = this.getFabricConfig(fabricType);
    return config.hasStitching;
  }

  /**
   * Get all available fabric types
   * @returns {array} List of fabric type objects
   */
  static getAvailableFabricTypes() {
    return Object.keys(this.fabricTypes).map(id => ({
      id,
      name: this.fabricTypes[id].name,
      hasStitching: this.fabricTypes[id].hasStitching
    }));
  }
}