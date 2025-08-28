// Static data for Products 2 page with associated prices

export const categories = [
  { name: 'Truck Seats' },
  { name: 'Car Seats' },
  { name: 'Van Seats' },
  { name: 'SUV Seats'},
  { name: 'Custom Seats'}
];

export const seatTypes = [
  { name: 'Standard', price: 25 },
  { name: 'Premium', price: 75 },
  { name: 'Deluxe', price: 125 },
  { name: 'Executive', price: 200 },
  { name: 'Sport', price: 150 }
];

export const armTypes = [
  { name: 'Fixed', price: 15 },
  { name: 'Adjustable', price: 45 },
  { name: 'Removable', price: 35 },
  { name: 'Folding', price: 25 },
  { name: 'None', price: 0 }
];

export const lumbarTypes = [
  { name: 'Standard', price: 20 },
  { name: 'Adjustable', price: 60 },
  { name: 'Memory Foam', price: 80 },
  { name: 'Gel', price: 90 },
  { name: 'None', price: 0 }
];

export const reclineTypes = [
  { name: 'Manual', price: 30 },
  { name: 'Power', price: 120 },
  { name: 'Memory', price: 180 },
  { name: 'Infinite', price: 150 },
  { name: 'Fixed', price: 0 }
];

export const heatOptions = [
  { name: 'None', price: 0 },
  { name: 'Low', price: 50 },
  { name: 'Medium', price: 75 },
  { name: 'High', price: 100 },
  { name: 'Adjustable', price: 125 }
];

export const materialTypes = [
  { name: 'Leather', price: 200 },
  { name: 'Fabric', price: 50 },
  { name: 'Vinyl', price: 75 },
  { name: 'Suede', price: 150 },
  { name: 'Mesh', price: 60 }
];

export const stitchPatterns = [
  { name: 'Plain', price: 0 },
  { name: 'Diamond', price: 25 },
  { name: 'Cross', price: 20 },
  { name: 'Wave', price: 30 },
  { name: 'Custom', price: 75 }
];

export const seatItemTypes = [
  { name: 'Driver Seat', price: 0 },
  { name: 'Passenger Seat', price: 0 },
  { name: 'Bench Seat', price: 50 },
  { name: 'Captain Chair', price: 100 },
  { name: 'Jump Seat', price: 25 }
];

export const colors = [
  { name: 'Black', price: 0 },
  { name: 'Gray', price: 10 },
  { name: 'Beige', price: 15 },
  { name: 'Brown', price: 20 },
  { name: 'Red', price: 25 },
  { name: 'Blue', price: 25 },
  { name: 'Green', price: 25 },
  { name: 'White', price: 30 }
];

// Sample products data
export const sampleProducts = [
  {
    id: '1',
    name: 'Premium Truck Driver Seat',
    category: 'Truck Seats',
    description: 'High-quality driver seat with premium features including adjustable lumbar support, memory foam padding, and power recline functionality.',
    basePrice: 599.99,
    stock: 25,
    images: ['/Gallery/01.png', '/Gallery//08.png', '/Gallery/Truckimages/truck03.jpg'],
    seatType: ['Premium'],
    armType: ['Adjustable'],
    lumbarType: ['Memory Foam'],
    reclineType: ['Power'],
    heatOption: ['High'],
    materialType: ['Leather'],
    stitchPattern: ['Diamond'],
    seatItemType: ['Driver Seat'],
    color: ['Black'],
    isActive: true,
    createdAt: '2024-01-15',
  },
 
  {
    id: '2',
    name: 'Custom Bench Seat',
    category: 'Custom Seats',
    description: 'Custom-designed bench seat with premium materials, unique stitching patterns, and personalized comfort features.',
    basePrice: 899.99,
    stock: 5,
    images: ['/Gallery/03.png', '/Gallery/04.png', '/Gallery/05.png', '/Gallery/06.png'],
    seatType: ['Deluxe'],
    armType: ['Removable'],
    lumbarType: ['Adjustable'],
    reclineType: ['Infinite'],
    heatOption: ['High'],
    materialType: ['Suede'],
    stitchPattern: ['Custom'],
    seatItemType: ['Bench Seat'],
    color: ['Blue'],
    isActive: true,
    createdAt: '2024-01-11',
  },
];
