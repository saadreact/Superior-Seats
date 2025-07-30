export interface Testimonial {
  id: number;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Mike Johnson',
    role: 'Long-Haul Trucker',
    rating: 5,
    text: 'The custom seat I ordered has completely transformed my driving experience. The massage feature is a game-changer for those 12-hour shifts.',
    avatar: '/api/placeholder/60/60'
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'RV Enthusiast',
    rating: 5,
    text: 'Superior Seats delivered exactly what I wanted. The leather quality is exceptional and the heating feature is perfect for our winter travels.',
    avatar: '/api/placeholder/60/60'
  },
  {
    id: 3,
    name: 'David Rodriguez',
    role: 'Van Conversion Specialist',
    rating: 5,
    text: 'Professional quality and attention to detail. My clients love the custom seats I install from Superior Seats.',
    avatar: '/api/placeholder/60/60'
  }
]; 