import * as THREE from 'three';

/**
 * TextureManager - Handles texture loading and caching without triggering React re-renders
 * Future-ready for JSON texture configurations
 */
export class TextureManager {
  static cache = new Map();
  static loader = new THREE.TextureLoader();

  /**
   * Load a single texture with caching
   * @param {string} url - Texture URL
   * @param {object} options - Texture options (colorSpace, flipY, etc.)
   * @returns {Promise<THREE.Texture>}
   */
  static async loadTexture(url, options = {}) {
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (texture) => {
          // Apply options
          texture.flipY = options.flipY !== undefined ? options.flipY : false;
          texture.colorSpace = options.colorSpace || THREE.NoColorSpace;
          texture.wrapS = options.wrapS || THREE.RepeatWrapping;
          texture.wrapT = options.wrapT || THREE.RepeatWrapping;
          
          if (options.repeat) {
            texture.repeat.set(options.repeat.x || 1, options.repeat.y || 1);
          }
          
          texture.needsUpdate = true;
          
          this.cache.set(cacheKey, texture);
          resolve(texture);
        },
        undefined,
        (error) => {
          console.warn(`Failed to load texture ${url}:`, error);
          reject(error);
        }
      );
    });
  }

  /**
   * Load multiple textures in parallel
   * @param {object} textureConfig - Map of texture names to URLs
   * @param {object} optionsMap - Map of texture names to options
   * @returns {Promise<object>} Map of texture names to loaded textures
   */
  static async loadTextures(textureConfig, optionsMap = {}) {
    const promises = Object.entries(textureConfig).map(async ([key, url]) => {
      const options = optionsMap[key] || {};
      const texture = await this.loadTexture(url, options);
      return [key, texture];
    });

    const results = await Promise.all(promises);
    return Object.fromEntries(results);
  }

  /**
   * Load textures from JSON configuration (future use)
   * @param {object} jsonConfig - JSON texture configuration
   * @returns {Promise<object>} Loaded textures
   */
  static async loadFromJSON(jsonConfig) {
    const textureMap = {};
    const optionsMap = {};

    for (const [key, config] of Object.entries(jsonConfig)) {
      if (typeof config === 'string') {
        // Simple URL string
        textureMap[key] = config;
      } else if (config.url) {
        // Object with URL and options
        textureMap[key] = config.url;
        optionsMap[key] = config.options || {};
      }
    }

    return this.loadTextures(textureMap, optionsMap);
  }

  /**
   * Clear cache (useful for memory management)
   */
  static clearCache() {
    this.cache.forEach(texture => texture.dispose());
    this.cache.clear();
  }

  /**
   * Preload a texture without waiting (useful for prefetching)
   */
  static preload(url, options = {}) {
    this.loadTexture(url, options).catch(() => {
      // Silently fail for preloading
    });
  }
}
