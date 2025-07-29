export interface Texture {
  id: string;
  name: string;
  price: number;
  image: string;
}

export const textures: Texture[] = [
  { id: 'leather', name: 'Premium Leather', price: 0, image: '/api/placeholder/80/80' },
  { id: 'fabric', name: 'Performance Fabric', price: -200, image: '/api/placeholder/80/80' },
  { id: 'suede', name: 'Luxury Suede', price: 150, image: '/api/placeholder/80/80' },
]; 