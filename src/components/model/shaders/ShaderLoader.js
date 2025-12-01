/**
 * Lazy shader loader - dynamically imports material shaders only when needed
 * This improves build time by splitting shader code into separate chunks
 */

// Cache for loaded shader modules to prevent redundant imports
const shaderModuleCache = new Map();

/**
 * Lazy load a shader module
 * @param {string} fabricType - The fabric type to load
 * @returns {Promise<object>} Module with createMaterial and updateUniforms functions
 */
async function loadShaderModule(fabricType) {
  // Check cache first
  if (shaderModuleCache.has(fabricType)) {
    return shaderModuleCache.get(fabricType);
  }

  let shaderModule;

  // Dynamic imports - webpack will create separate chunks for each
  switch (fabricType) {
    case 'leather':
      shaderModule = await import('./LeatherMaterial');
      break;
    case 'cloth':
    case 'miami-corp-cloths':
      shaderModule = await import('./ClothMaterial');
      break;
    case 'suede':
      shaderModule = await import('./SuedeMaterial');
      break;
    case 'vinyl':
      shaderModule = await import('./VinylMaterial');
      break;
    case 'mesh':
      shaderModule = await import('./MeshMaterial');
      break;
    case 'carbon':
      shaderModule = await import('./CarbonFiberMaterial');
      break;
    case 'miami-vinyl':
      shaderModule = await import('./MiamiVinylMaterial');
      break;
    case 'ultraleather':
    case 'ultrafabrics':
      shaderModule = await import('./UltraleatherMaterial');
      break;
    case 'brisa-distressed':
      shaderModule = await import('./BrisaDistressedMaterial');
      break;
    case 'carroll-leather':
      shaderModule = await import('./CarrollLeatherMaterial');
      break;
    default:
      console.warn(`Unknown fabric type: ${fabricType}, falling back to leather`);
      shaderModule = await import('./LeatherMaterial');
  }

  // Cache the loaded module
  shaderModuleCache.set(fabricType, shaderModule);
  return shaderModule;
}

/**
 * Get material creation and update functions for a fabric type
 * @param {string} fabricType - The fabric type
 * @returns {Promise<object>} Object with createMaterial and updateUniforms functions
 */
export async function getShaderFunctions(fabricType) {
  const shaderModule = await loadShaderModule(fabricType);
  
  // Return the functions from the module
  return {
    createMaterial: shaderModule.createLeatherMaterial || 
                   shaderModule.createClothMaterial || 
                   shaderModule.createSuedeMaterial || 
                   shaderModule.createVinylMaterial || 
                   shaderModule.createMeshMaterial || 
                   shaderModule.createCarbonFiberMaterial || 
                   shaderModule.createMiamiVinylMaterial || 
                   shaderModule.createUltraleatherMaterial || 
                   shaderModule.createBrisaDistressedMaterial || 
                   shaderModule.createCarrollLeatherMaterial,
    updateUniforms: shaderModule.updateLeatherUniforms || 
                   shaderModule.updateClothUniforms || 
                   shaderModule.updateSuedeUniforms || 
                   shaderModule.updateVinylUniforms || 
                   shaderModule.updateMeshUniforms || 
                   shaderModule.updateCarbonFiberUniforms || 
                   shaderModule.updateMiamiVinylUniforms || 
                   shaderModule.updateUltraleatherUniforms || 
                   shaderModule.updateBrisaDistressedUniforms || 
                   shaderModule.updateCarrollLeatherUniforms
  };
}

/**
 * Clear the shader module cache (useful for hot-reloading in development)
 */
export function clearShaderCache() {
  shaderModuleCache.clear();
}
