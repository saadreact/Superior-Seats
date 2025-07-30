export interface Color {
  id: string;
  name: string;
  hex: string;
}

export const colors: Color[] = [
  { id: 'black', name: 'Classic Black', hex: '#000000' },
  { id: 'red', name: 'Bold Red', hex: '#d32f2f' },
  { id: 'beige', name: 'Elegant Beige', hex: '#f5f5dc' },
  { id: 'gray', name: 'Modern Gray', hex: '#808080' },
  { id: 'brown', name: 'Rich Brown', hex: '#8b4513' },
  { id: 'navy', name: 'Navy Blue', hex: '#1a237e' },
  { id: 'white', name: 'Pure White', hex: '#ffffff' },
  { id: 'green', name: 'Forest Green', hex: '#2e7d32' },
  { id: 'purple', name: 'Royal Purple', hex: '#6a1b9a' },
  { id: 'orange', name: 'Vibrant Orange', hex: '#f57c00' },
  { id: 'pink', name: 'Soft Pink', hex: '#ec407a' },
  { id: 'yellow', name: 'Sunny Yellow', hex: '#fbc02d' },
  { id: 'teal', name: 'Ocean Teal', hex: '#00695c' },
  { id: 'maroon', name: 'Deep Maroon', hex: '#8e0000' },
  { id: 'cream', name: 'Warm Cream', hex: '#fff8e1' },
]; 