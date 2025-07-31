// Type definitions
export interface WorkImage {
  id: number;
  title: string;
  image: string;
  description: string;
}

// Work pictures - you can add your actual work images here
export const workPictures: WorkImage[] = [
  { id: 1, title: 'Custom Car Interior', image: '/Gallery/01.png', description: 'Luxury car seat restoration' },
  { id: 2, title: 'Truck Seat Upgrade', image: '/Gallery/02.png', description: 'Commercial truck seat modification' },
  { id: 3, title: 'Boat Seat Project', image: '/Gallery/03.png', description: 'Marine seating solution' },
  { id: 4, title: 'Motorcycle Custom', image: '/Gallery/04.png', description: 'Custom bike seat design' },
  { id: 5, title: 'Classic Car Restoration', image: '/Gallery/05.png', description: 'Vintage car seat restoration' },
  { id: 6, title: 'Modern Interior', image: '/Gallery/06.png', description: 'Contemporary seating design' },
  { id: 7, title: 'Luxury Upgrade', image: '/Gallery/07.png', description: 'Premium material upgrade' },
  { id: 8, title: 'Custom Stitching', image: '/Gallery/08.png', description: 'Hand-stitched details' },
  { id: 9, title: 'Ergonomic Design', image: '/Gallery/09.png', description: 'Comfort-focused seating' },
]; 