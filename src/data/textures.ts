export interface Texture {
  id: string;
  name: string;
  price: number;
  image: string;
}

export const textures: Texture[] = [
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