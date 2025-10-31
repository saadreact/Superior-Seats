// Comprehensive color palette extracted from all fabric variants
// Organized by color families for better UI organization

export const COLOR_PALETTE = {
  // Whites & Creams
  whites: [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Ice', hex: '#F0F8FF' },
    { name: 'Sea Salt', hex: '#F8F8FF' },
    { name: 'Ice Water', hex: '#E0FFFF' },
    { name: 'Milk', hex: '#FEFCFF' },
    { name: 'Ivory', hex: '#FFFFF0' },
    { name: 'Papyrus', hex: '#F5DEB3' },
    { name: 'Pelican', hex: '#F5F5DC' },
    { name: 'Diamond Jubilee', hex: '#E8E8E8' }
  ],

  // Grays & Silvers
  grays: [
    { name: 'Silver Pearl', hex: '#C0C0C0' },
    { name: 'Lone Star Silver', hex: '#B8B8B8' },
    { name: 'Fog', hex: '#D3D3D3' },
    { name: 'Dove', hex: '#DCDCDC' },
    { name: 'Pebble Beach', hex: '#A9A9A9' },
    { name: 'Pumice', hex: '#A0A0A0' },
    { name: 'Elephant', hex: '#696969' },
    { name: 'Guiltless Gray', hex: '#707070' },
    { name: 'Discovery Grey', hex: '#808080' }
  ],

  // Blacks & Charcoals
  blacks: [
    { name: 'Black', hex: '#000000' },
    { name: 'Lonestar Black', hex: '#0A0A0A' },
    { name: 'Raven Wing', hex: '#1C1C1C' },
    { name: 'Hurricane Black', hex: '#1A1A1A' },
    { name: 'Alaskan Night', hex: '#0F0F0F' },
    { name: 'Pearl Black', hex: '#2C2C2C' },
    { name: 'Charcoal', hex: '#36454F' },
    { name: 'Caprone Charcoal', hex: '#404040' },
    { name: 'Ink', hex: '#2F4F4F' },
    { name: 'Dark Sky', hex: '#2B4A4A' },
    { name: 'Iron', hex: '#4C4C4C' }
  ],

  // Browns & Tans
  browns: [
    { name: 'Fudge', hex: '#8B4513' },
    { name: 'Brown Sugar', hex: '#9A4F1A' },
    { name: 'Bison', hex: '#7A3E0F' },
    { name: 'Hide', hex: '#A0522D' },
    { name: 'Waylan', hex: '#B55A35' },
    { name: 'Pure Cognac', hex: '#954A25' },
    { name: 'Steerhide', hex: '#654321' },
    { name: 'Taupe', hex: '#483C32' },
    { name: 'Pelt', hex: '#8B7355' },
    { name: 'Sand', hex: '#C2B280' },
    { name: 'Baja Tan', hex: '#D2B48C' },
    { name: 'Buckskin', hex: '#DEB887' },
    { name: 'Moccasin', hex: '#FFE4B5' },
    { name: 'Buff', hex: '#F0DC82' },
    { name: 'Chamois', hex: '#A08040' },
    { name: 'Tawny', hex: '#CD853F' },
    { name: 'Maple', hex: '#D2691E' },
    { name: 'Stargo Maple', hex: '#CD853F' },
    { name: 'Cappuccino', hex: '#CC6600' }
  ],

  // Reds & Pinks
  reds: [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Tropical Red', hex: '#DC143C' },
    { name: 'Royal Red', hex: '#B22222' },
    { name: 'Retro Red', hex: '#CD5C5C' },
    { name: 'Chianti', hex: '#8B0000' },
    { name: 'Pomegranate', hex: '#C21807' },
    { name: 'Red Cherries', hex: '#DE3163' },
    { name: 'Hibiscus', hex: '#FF6347' },
    { name: 'Bittersweet', hex: '#FE6F5E' }
  ],

  // Blues
  blues: [
    { name: 'Marine Blue', hex: '#000080' },
    { name: 'Nautical Blue', hex: '#191970' },
    { name: 'Admiral', hex: '#1E1E7A' },
    { name: 'Deep Blue', hex: '#0F0F8A' },
    { name: 'Cayman Blue', hex: '#4682B4' },
    { name: 'Ocean Storm', hex: '#2E4A6B' },
    { name: 'Bayou', hex: '#2A4560' },
    { name: 'Island Sky', hex: '#87CEEB' },
    { name: 'Polar Breeze', hex: '#B0E0E6' },
    { name: 'Blue Turquoise', hex: '#00CED1' },
    { name: 'Tahiti Reef', hex: '#40E0D0' },
    { name: 'Aqua Spray', hex: '#7FDBFF' }
  ],

  // Teals & Greens
  teals: [
    { name: 'Teal Waters', hex: '#008080' },
    { name: 'Gulf Stream', hex: '#008B8B' },
    { name: 'Lagoon', hex: '#007F7F' },
    { name: 'Cancun', hex: '#20B2AA' },
    { name: 'Palm Green', hex: '#228B22' },
    { name: 'Emerald Isle', hex: '#50C878' },
    { name: 'Lime Cooler', hex: '#32CD32' }
  ],

  // Purples & Plums
  purples: [
    { name: 'Majestic Purple', hex: '#8A2BE2' },
    { name: 'Asian Plum', hex: '#8E4585' },
    { name: 'Plum', hex: '#9A4A95' }
  ],

  // Yellows & Golds
  yellows: [
    { name: 'Jamaican Sun', hex: '#FFD700' },
    { name: 'Bonanza Gold', hex: '#DAA520' },
    { name: 'Sunglow', hex: '#FFCC33' },
    { name: 'Curry', hex: '#CC9900' }
  ]
};

// Flatten all colors for easy access
export const ALL_COLORS = Object.values(COLOR_PALETTE).flat();

// Get colors by category
export const getColorsByCategory = (category) => {
  return COLOR_PALETTE[category] || [];
};

// Find color by name or hex
export const findColor = (searchTerm) => {
  return ALL_COLORS.find(color => 
    color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    color.hex.toLowerCase() === searchTerm.toLowerCase()
  );
};

// Get color categories
export const COLOR_CATEGORIES = Object.keys(COLOR_PALETTE);