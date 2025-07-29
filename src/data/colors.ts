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
]; 