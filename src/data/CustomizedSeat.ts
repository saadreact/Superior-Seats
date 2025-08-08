// CONSOLIDATED DATA FILE: Contains all customization data (objects, textures, colors)

// Texture interface and data
export interface Texture {
  id: string;
  name: string;
  price: number;
  image: string;
}


export const textures: Texture[] = [
  { id: 'none', name: '', price: 0, image: '/Textures/01.jpg' }, 
  { id: 'leather', name: 'Premium Leather', price: 200, image: '/Textures/01.jpg' },
  { id: 'fabric', name: 'Performance Fabric', price: 400, image: '/Textures/02.jpg' },
  { id: 'suede', name: 'Luxury Suede', price: 230, image: '/Textures/03.jpg' },
  { id: 'nappa', name: 'Nappa Leather', price: 300, image: '/Textures/04.jpg' },
  { id: 'alcantara', name: 'Alcantara', price: 400, image: '/Textures/05.jpg' },
  { id: 'mesh', name: 'Breathable Mesh', price: 150, image: '/Textures/06.jpg' },
  { id: 'vinyl', name: 'Premium Vinyl', price: 100, image: '/Textures/07.jpg' },
  { id: 'microfiber', name: 'Microfiber', price: 500, image: '/Textures/08.jpg' },
  { id: 'perforated', name: 'Perforated Leather', price: 200, image: '/Textures/09.jpg' },
  { id: 'carbon', name: 'Carbon Fiber', price: 600, image: '/Textures/03.jpg' },
  { id: 'velvet', name: 'Luxury Velvet', price: 250, image: '/Textures/04.jpg' },
  { id: 'canvas', name: 'Durable Canvas', price: 300, image: '/Textures/05.jpg' },
  { id: 'silk', name: 'Silk Blend', price: 350, image: '/Textures/01.jpg' },
  { id: 'denim', name: 'Premium Denim', price: 500, image: '/Textures/07.jpg' },
  { id: 'cork', name: 'Natural Cork', price: 100, image: '/Textures/04.jpg' },
];
export const stichtingtextures: Texture[] = [
  { id: 'none', name: '', price: 0, image: '/Textures/01.jpg' }, 
  { id: 'leather', name: 'Microfiber', price: 500, image: '/stitchpatterns/08.jpg' },
  { id: 'fabric', name: 'Performance Fabric', price: 400, image: '/stitchpatterns/02.jpg' },
  { id: 'suede', name: 'Luxury Suede', price: 230, image: '/stitchpatterns/03.jpg' },
  { id: 'nappa', name: 'Nappa Leather', price: 300, image: '/stitchpatterns/04.jpg' },
  { id: 'alcantara', name: 'Alcantara', price: 400, image: '/stitchpatterns/05.jpg' },
  { id: 'mesh', name: 'Breathable Mesh', price: 150, image: '/stitchpatterns/06.jpg' },
  { id: 'vinyl', name: 'Premium Vinyl', price: 100, image: '/stitchpatterns/07.jpg' },


];

// Color interface and data
export interface Color {
  id: string;
  name: string;
  hex: string;
  price: number; 
}

export const colors: Color[] = [
  { id: 'none', name: 'None', hex: '#cccccc', price: 0 }, 
  { id: 'black', name: 'Classic Black', hex: '#000000', price: 0 }, 
  { id: 'red', name: 'Bold Red', hex: '#d32f2f', price: 50 },
  { id: 'beige', name: 'Elegant Beige', hex: '#f5f5dc', price: 25 },
  { id: 'gray', name: 'Modern Gray', hex: '#808080', price: 30 },
  { id: 'brown', name: 'Rich Brown', hex: '#8b4513', price: 40 },
  { id: 'navy', name: 'Navy Blue', hex: '#1a237e', price: 45 },
  { id: 'white', name: 'Pure White', hex: '#ffffff', price: 20 },
  { id: 'green', name: 'Forest Green', hex: '#2e7d32', price: 35 },
  { id: 'purple', name: 'Royal Purple', hex: '#6a1b9a', price: 60 },
  { id: 'orange', name: 'Vibrant Orange', hex: '#f57c00', price: 55 },
  { id: 'pink', name: 'Soft Pink', hex: '#ec407a', price: 65 },
  { id: 'yellow', name: 'Sunny Yellow', hex: '#fbc02d', price: 70 },
  { id: 'teal', name: 'Ocean Teal', hex: '#00695c', price: 50 },
  { id: 'maroon', name: 'Deep Maroon', hex: '#8e0000', price: 45 },
  { id: 'cream', name: 'Warm Cream', hex: '#fff8e1', price: 30 },
];

// Object interface and data
export interface CustomObject {
  id: string;
  name: string;
  price: number;
}

export const objects: CustomObject[] = [
  { id: 'sofa', name: 'Car Seat', price: 899 },
  { id: 'car', name: 'Back Double Seat', price: 1299 },
  { id: 'truck', name: 'Truck Seat', price: 1499 },
  { id: 'racing', name: 'Van Seat', price: 1899 },
  { id: 'office', name: 'Ship Seats', price: 699 },
];