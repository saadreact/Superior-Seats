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
  { number: 25, label: 'Years Experience', suffix: '+' },
  { number: 20000, label: 'Custom Seats Built', suffix: '+' },
  { number: 50, label: 'Seat Models', suffix: '+' },
];

export interface SeatStyleImage {
  id: number;
  seat_style_id: number;
  image_path: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image_url: string;
}

export interface SeatStyle {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images: SeatStyleImage[];
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  has_more_pages: boolean;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ApiResponse {
  status: string;
  message: string;
  data: SeatStyle[];
  errors: any;
  meta: {
    timestamp: string;
    request_id: string;
    pagination: PaginationMeta;
  };
}
