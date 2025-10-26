// Asset configuration for 3D models and textures
// This file dynamically loads models and textures based on model ID

// Generic model loader - automatically maps model ID to asset paths
export const getModelConfig = (modelId) => {
  return {
    model: `/assets/models/${modelId}/chair1_v03.glb`,
    textures: {
      //baseColor: `/assets/textures/${modelId}/base_color.jpg`,
      //normal: `/assets/textures/${modelId}/Base_Normal.jpg`,
      diamondNormal: `/assets/textures/${modelId}/Diamond_Normal.jpg`,
      //metallic: `/assets/textures/${modelId}/Metallic.jpg`,
      //roughness: `/assets/textures/${modelId}/Roughness.jpg`,
      ao: `/assets/textures/${modelId}/AO.jpg`,
      stitch: `/assets/textures/${modelId}/stich_png.png`,
      //stitch1: `/assets/textures/${modelId}/stich_png1.png`,
      //stitch2: `/assets/textures/${modelId}/stich_png02.png`,
      //brick: `/assets/textures/${modelId}/brick.jpeg`
    },
    scale: [1.5, 1.5, 1.5],
    position: [0, -0.5, 0],
    rotation: [0, 0, 0]
  };
};

// Legacy support - keep existing MODELS export for compatibility
export const MODELS = {
  'chair1': getModelConfig('1'),
  'chair2': getModelConfig('2')
};

// Available models list
export const AVAILABLE_MODELS = [
  { id: '1', name: 'Chair Model 1', description: 'First chair variant' },
  { id: '2', name: 'Chair Model 2', description: 'Second chair variant' }
];

// Customization options for UI components
export const CUSTOMIZATION_OPTIONS = {
  materials: [
    { id: 'leather', name: 'Premium Leather', color: '#8B4513' },
    { id: 'cloth', name: 'Fabric Cloth', color: '#4A4A4A' },
    { id: 'suede', name: 'Suede Material', color: '#8B7355' },
    { id: 'vinyl', name: 'Synthetic Vinyl', color: '#2C2C2C' },
    { id: 'mesh', name: 'Breathable Mesh', color: '#555555' },
    { id: 'carbon', name: 'Carbon Fiber', color: '#1a1a1a' }
  ],
  
  colors: {
    primary: [
      { id: 'brown', name: 'Brown Leather', hex: '#8B4513' },
      { id: 'black', name: 'Black', hex: '#2C2C2C' },
      { id: 'charcoal', name: 'Charcoal', hex: '#36454F' },
      { id: 'tan', name: 'Tan', hex: '#D2B48C' },
      { id: 'red', name: 'Red', hex: '#A52A2A' },
      { id: 'blue', name: 'Blue', hex: '#4A90E2' },
      { id: 'gray', name: 'Gray', hex: '#666666' },
      { id: 'dark_gray', name: 'Dark Gray', hex: '#1C1C1C' }
    ]
  },

  stitching: {
    colors: [
      { id: 'white', name: 'White', hex: '#ffffff' },
      { id: 'red', name: 'Red', hex: '#ff0000' },
      { id: 'blue', name: 'Blue', hex: '#0066cc' },
      { id: 'gold', name: 'Gold', hex: '#ffd700' },
      { id: 'black', name: 'Black', hex: '#000000' },
      { id: 'green', name: 'Green', hex: '#00aa00' }
    ]
  }
};
