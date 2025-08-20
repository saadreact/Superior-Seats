import { Chair, EventSeat, AirlineSeatReclineNormal } from '@mui/icons-material';

export interface SeatingProduct {
  id: number;
  title: string;
  description: string;
  price: string;
  rating: number;
  features: string[];
  iconName: string;
  image: string;
}

export interface Stat {
  number: number;
  label: string;
  suffix: string;
}

export const seatingProducts: SeatingProduct[] = [
  {
    id: 1,
    title: 'Truck Seats',
    description: 'Premium truck seating with custom options and superior comfort.',
    price: 'Custom',
    rating: 4.9,
    features: ['Custom', 'Comfort', 'Durable'],
    iconName: 'Chair',
    image: '/Gallery/28.png',
  },
  {
    id: 2,
    title: 'RV Seats',
    description: 'Luxury RV seating designed for long-haul comfort and style.',
    price: 'Custom',
    rating: 4.8,
    features: ['Luxury', 'Comfort', 'Custom'],
    iconName: 'EventSeat',
    image: '/Gallery/02.png',
  },
  {
    id: 3,
    title: 'Van Seats',
    description: 'Professional van seating with integrated safety features.',
    price: 'Custom',
    rating: 4.7,
    features: ['Professional', 'Safety', 'Custom'],
    iconName: 'AirlineSeatReclineNormal',
    image: '/Gallery/14.png',
  },
];

export const stats: Stat[] = [
  { number: 20000, label: 'Custom Seats Built', suffix: '+' },
  { number: 25, label: 'Years Experience', suffix: '+' },
  { number: 50, label: 'Seat Models', suffix: '+' },
];
