import * as THREE from 'three';

/**
 * Pattern Loader Utility
 * Manages dynamic loading and organization of pattern textures
 */

// Model-specific pattern configuration
// Each model loads patterns from its corresponding folder: assets/patterns/{modelId}/
export const getModelPatterns = (modelId) => {
  const basePath = `/assets/patterns/${modelId}`;
  return [
    { id: `${modelId}-1`, name: 'Pattern 1', path: `${basePath}/1.jpg`, preview: `${basePath}/1-preview.jpg` },
    { id: `${modelId}-2`, name: 'Pattern 2', path: `${basePath}/02.jpg`, preview: `${basePath}/02-preview.jpg` },
    { id: `${modelId}-3`, name: 'Pattern 3', path: `${basePath}/03.jpg`, preview: `${basePath}/03-preview.jpg` },
    { id: `${modelId}-4`, name: 'Pattern 4', path: `${basePath}/04.jpg`, preview: `${basePath}/04-preview.jpg` },
    { id: `${modelId}-5`, name: 'Pattern 5', path: `${basePath}/05.jpg`, preview: `${basePath}/05-preview.jpg` },
    { id: `${modelId}-6`, name: 'Pattern 6', path: `${basePath}/06.jpg`, preview: `${basePath}/06-preview.jpg` }
  ];
};

// Default pattern (fallback)
export const DEFAULT_PATTERN = {
  id: 'default',
  name: 'No Pattern',
  path: null
};

class PatternLoader {
  constructor() {
    this.loadedTextures = new Map();
    this.textureLoader = new THREE.TextureLoader();
  }

  /**
   * Get patterns for a specific model
   */
  getPatternsForModel(modelId) {
    const patterns = [DEFAULT_PATTERN];
    const modelPatterns = getModelPatterns(modelId);
    patterns.push(...modelPatterns);
    return patterns;
  }

  /**
   * Get all patterns for all models (for preloading)
   */
  getAllPatterns() {
    const allPatterns = [DEFAULT_PATTERN];
    // Load patterns for both model 1 and model 2
    ['1', '2'].forEach(modelId => {
      const modelPatterns = getModelPatterns(modelId);
      allPatterns.push(...modelPatterns);
    });
    return allPatterns;
  }

  /**
   * Load a single pattern texture
   */
  async loadPattern(patternPath) {
    if (!patternPath) {
      return null; // No pattern case
    }

    if (this.loadedTextures.has(patternPath)) {
      return this.loadedTextures.get(patternPath);
    }

    return new Promise((resolve, reject) => {
        this.textureLoader.load(
        patternPath,
        (texture) => {
          // Configure texture settings to match diamond normal texture
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.flipY = false;
          texture.colorSpace = THREE.NoColorSpace; // Normal maps use linear space
          texture.anisotropy = 8; // Better quality at angles
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          
          // Cache the texture
          this.loadedTextures.set(patternPath, texture);
          resolve(texture);
        },
        (progress) => {
          console.log(`Loading pattern ${patternPath}: ${(progress.loaded / progress.total * 100)}%`);
        },
        (error) => {
          console.error(`Failed to load pattern ${patternPath}:`, error);
          reject(error);
        }
      );
    });
  }

  /**
   * Preload multiple patterns
   */
  async preloadPatterns(patterns) {
    const loadPromises = patterns
      .filter(pattern => pattern.path) // Skip patterns without paths
      .map(pattern => this.loadPattern(pattern.path));
    
    try {
      const textures = await Promise.all(loadPromises);
      console.log(`✅ Preloaded ${textures.filter(t => t).length} pattern textures`);
      return textures;
    } catch (error) {
      console.error('Error preloading patterns:', error);
      return [];
    }
  }

  /**
   * Get pattern by ID across all models
   */
  findPatternById(patternId) {
    if (patternId === 'default' || patternId === null || patternId === undefined) {
      return DEFAULT_PATTERN;
    }

    // Search through all model patterns
    for (const modelId of ['1', '2']) {
      const modelPatterns = getModelPatterns(modelId);
      const pattern = modelPatterns.find(p => p.id === patternId);
      if (pattern) {
        return pattern;
      }
    }

    console.warn(`Pattern ${patternId} not found, using default`);
    return DEFAULT_PATTERN;
  }

  /**
   * Get loaded texture for a pattern
   */
  getTexture(patternPath) {
    return this.loadedTextures.get(patternPath) || null;
  }

  /**
   * Create a pattern texture with fallback
   */
  async createPatternTexture(patternId) {
    const pattern = this.findPatternById(patternId);
    
    if (!pattern.path) {
      // Return null for no pattern case - shaders will handle this
      return null;
    }

    try {
      return await this.loadPattern(pattern.path);
    } catch (error) {
      console.error(`Failed to create texture for pattern ${patternId}:`, error);
      return null;
    }
  }

  /**
   * Clear cached textures (for memory management)
   */
  clearCache() {
    this.loadedTextures.forEach(texture => {
      texture.dispose();
    });
    this.loadedTextures.clear();
    console.log('🗑️ Pattern texture cache cleared');
  }
}

// Export singleton instance
export const patternLoader = new PatternLoader();

/**
 * Convenience function to get pattern options for a specific model
 */
export const getPatternOptionsForModel = (modelId) => {
  return patternLoader.getPatternsForModel(modelId).map(pattern => ({
    id: pattern.id,
    name: pattern.name,
    path: pattern.path,
    thumbnail: pattern.preview || pattern.path // Use preview image for thumbnails
  }));
};

/**
 * Convenience function to get all pattern options (for backward compatibility)
 */
export const getPatternOptions = () => {
  return patternLoader.getAllPatterns().map(pattern => ({
    id: pattern.id,
    name: pattern.name,
    path: pattern.path,
    thumbnail: pattern.preview || pattern.path // Use preview image for thumbnails
  }));
};

/**
 * Convenience function to preload all patterns
 */
export const preloadAllPatterns = async () => {
  const allPatterns = patternLoader.getAllPatterns();
  return patternLoader.preloadPatterns(allPatterns);
};