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
  { id: 'leather', name: 'Premium Leather', price: 200, image: '/Textures/01.png' },
  { id: 'fabric', name: 'Performance Fabric', price: 400, image: '/Textures/02.png' },
  { id: 'suede', name: 'Luxury Suede', price: 230, image: '/Textures/03.png' },
  { id: 'nappa', name: 'Nappa Leather', price: 300, image: '/Textures/04.png' },
  { id: 'alcantara', name: 'Alcantara', price: 400, image: '/Textures/05.png' },
  { id: 'mesh', name: 'Breathable Mesh', price: 150, image: '/Textures/06.png' },

];
export const stichtingtextures: Texture[] = [
  { id: 'none', name: '', price: 0, image: '/Textures/01.jpg' }, 
  { id: 'leather', name: 'SINGLE NEEDLE/MEDIUM DIAMOND', price: 500, image: '/Stichtingpatterns/01.png' },
  { id: 'fabric', name: 'DOUBLE NEEDLE/LARGE DIAMOND', price: 400, image: '/Stichtingpatterns/02.png' },
  { id: 'suede', name: 'SINGLE NEEDLE QUILTS', price: 230, image: '/Stichtingpatterns/03.png' },
  { id: 'nappa', name: 'SINGLE NEEDLE/SMALL DIAMOND', price: 300, image: '/Stichtingpatterns/04.png' },
  { id: 'alcantara', name: 'DOUBLE NEEDLE/LARGE DIAMOND', price: 400, image: '/Stichtingpatterns/05.png' },
  { id: 'mesh', name: 'DOUBLE NEEDLE QUILTS', price: 150, image: '/Stichtingpatterns/06.png' },



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

// Vehicle data interfaces and arrays
export interface VehicleOption {
  id: string;
  name: string;
}

export const vehicleYears: VehicleOption[] = [
  { id: '2024', name: '2024' },
  { id: '2023', name: '2023' },
  { id: '2022', name: '2022' },
  { id: '2021', name: '2021' },
  { id: '2020', name: '2020' },
  { id: '2019', name: '2019' },
  { id: '2018', name: '2018' },
  { id: '2017', name: '2017' },
  { id: '2016', name: '2016' },
  { id: '2015', name: '2015' },
];

export const vehicleMakes: VehicleOption[] = [
  { id: 'ford', name: 'Ford' },
  { id: 'chevrolet', name: 'Chevrolet' },
  { id: 'toyota', name: 'Toyota' },
  { id: 'honda', name: 'Honda' },
  { id: 'nissan', name: 'Nissan' },
  { id: 'dodge', name: 'Dodge' },
  { id: 'ram', name: 'RAM' },
  { id: 'gmc', name: 'GMC' },
  { id: 'bmw', name: 'BMW' },
  { id: 'mercedes', name: 'Mercedes-Benz' },
  { id: 'audi', name: 'Audi' },
  { id: 'volkswagen', name: 'Volkswagen' },
  { id: 'hyundai', name: 'Hyundai' },
  { id: 'kia', name: 'Kia' },
  { id: 'mazda', name: 'Mazda' },
  { id: 'subaru', name: 'Subaru' },
  { id: 'lexus', name: 'Lexus' },
  { id: 'acura', name: 'Acura' },
  { id: 'infiniti', name: 'Infiniti' },
  { id: 'volvo', name: 'Volvo' },
];

export const vehicleModels: VehicleOption[] = [
  { id: 'f150', name: 'F-150' },
  { id: 'f250', name: 'F-250' },
  { id: 'f350', name: 'F-350' },
  { id: 'silverado', name: 'Silverado' },
  { id: 'sierra', name: 'Sierra' },
  { id: 'tacoma', name: 'Tacoma' },
  { id: 'tundra', name: 'Tundra' },
  { id: 'civic', name: 'Civic' },
  { id: 'accord', name: 'Accord' },
  { id: 'camry', name: 'Camry' },
  { id: 'corolla', name: 'Corolla' },
  { id: 'altima', name: 'Altima' },
  { id: 'sentra', name: 'Sentra' },
  { id: 'charger', name: 'Charger' },
  { id: 'challenger', name: 'Challenger' },
  { id: '1500', name: '1500' },
  { id: '2500', name: '2500' },
  { id: '3500', name: '3500' },
  { id: 'x5', name: 'X5' },
  { id: 'x3', name: 'X3' },
  { id: 'cclass', name: 'C-Class' },
  { id: 'eclass', name: 'E-Class' },
  { id: 'a4', name: 'A4' },
  { id: 'a6', name: 'A6' },
  { id: 'golf', name: 'Golf' },
  { id: 'jetta', name: 'Jetta' },
  { id: 'sonata', name: 'Sonata' },
  { id: 'elantra', name: 'Elantra' },
  { id: 'optima', name: 'Optima' },
  { id: 'sportage', name: 'Sportage' },
  { id: 'cx5', name: 'CX-5' },
  { id: 'cx9', name: 'CX-9' },
  { id: 'outback', name: 'Outback' },
  { id: 'forester', name: 'Forester' },
  { id: 'rx', name: 'RX' },
  { id: 'nx', name: 'NX' },
  { id: 'tlx', name: 'TLX' },
  { id: 'rdx', name: 'RDX' },
  { id: 'q50', name: 'Q50' },
  { id: 'q60', name: 'Q60' },
  { id: 'xc60', name: 'XC60' },
  { id: 'xc90', name: 'XC90' },
];

export const vehicleTrims: VehicleOption[] = [
  { id: 'xlt', name: 'XLT' },
  { id: 'lariat', name: 'Lariat' },
  { id: 'platinum', name: 'Platinum' },
  { id: 'king-ranch', name: 'King Ranch' },
  { id: 'limited', name: 'Limited' },
  { id: 'lt', name: 'LT' },
  { id: 'ltz', name: 'LTZ' },
  { id: 'high-country', name: 'High Country' },
  { id: 'sr5', name: 'SR5' },
  { id: 'trd-sport', name: 'TRD Sport' },
  { id: 'trd-off-road', name: 'TRD Off-Road' },
  { id: 'limited', name: 'Limited' },
  { id: 'se', name: 'SE' },
  { id: 'sx', name: 'SX' },
  { id: 'ex', name: 'EX' },
  { id: 'lx', name: 'LX' },
  { id: 'touring', name: 'Touring' },
  { id: 'elite', name: 'Elite' },
  { id: 'advance', name: 'Advance' },
  { id: 'premium', name: 'Premium' },
  { id: 'luxury', name: 'Luxury' },
  { id: 'ultimate', name: 'Ultimate' },
  { id: 'prestige', name: 'Prestige' },
  { id: 'exclusive', name: 'Exclusive' },
  { id: 'signature', name: 'Signature' },
  { id: 'momentum', name: 'Momentum' },
  { id: 'inscription', name: 'Inscription' },
];

// Variation options interface
export interface VariationOption {
  id: string;
  name: string;
  price?: number;
}

// Recline options
export const reclineOptions: VariationOption[] = [
  { id: 'manual', name: 'Manual Recline', price: 0 },
  { id: 'power', name: 'Power Recline', price: 150 },
  { id: 'memory', name: 'Memory Power Recline', price: 250 },
  { id: 'infinite', name: 'Infinite Recline', price: 300 },
  { id: 'flat', name: 'Flat Recline', price: 200 },
];

// Child restraint options
export const childRestraintOptions: VariationOption[] = [
  { id: 'none', name: 'No Child Restraint', price: 0 },
  { id: 'integrated', name: 'Integrated Child Restraint', price: 100 },
  { id: 'removable', name: 'Removable Child Restraint', price: 120 },
  { id: 'adjustable', name: 'Adjustable Child Restraint', price: 150 },
  { id: 'isofix', name: 'ISOFIX Child Restraint', price: 180 },
];

// 6 motor back relaxer options
export const motorBackRelaxerOptions: VariationOption[] = [
  { id: 'none', name: 'No Motor Back Relaxer', price: 0 },
  { id: '2-motor', name: '2 Motor Back Relaxer', price: 200 },
  { id: '4-motor', name: '4 Motor Back Relaxer', price: 350 },
  { id: '6-motor', name: '6 Motor Back Relaxer', price: 500 },
  { id: '8-motor', name: '8 Motor Back Relaxer', price: 650 },
];

// Lumber support options
export const lumberOptions: VariationOption[] = [
  { id: 'none', name: 'No Lumber Support', price: 0 },
  { id: 'manual', name: 'Manual Lumber Support', price: 50 },
  { id: 'power', name: 'Power Lumber Support', price: 100 },
  { id: 'adjustable', name: 'Adjustable Lumber Support', price: 150 },
  { id: 'memory', name: 'Memory Lumber Support', price: 200 },
];

// Heating and cooling options
export const heatingCoolingOptions: VariationOption[] = [
  { id: 'none', name: 'No Heating/Cooling', price: 0 },
  { id: 'heating-only', name: 'Heating Only', price: 120 },
  { id: 'cooling-only', name: 'Cooling Only', price: 150 },
  { id: 'heating-cooling', name: 'Heating & Cooling', price: 250 },
  { id: 'ventilated', name: 'Ventilated Heating & Cooling', price: 350 },
  { id: 'massage', name: 'Massage with Heating & Cooling', price: 450 },
];

// Seat options interface
export interface SeatOption {
  id: string;
  name: string;
  price?: number;
}

// Seat type options
export const seatTypeOptions: SeatOption[] = [
  { id: 'bucket', name: 'Bucket Seat', price: 0 },
  { id: 'bench', name: 'Bench Seat', price: 50 },
  { id: 'captain', name: 'Captain Seat', price: 75 },
  { id: 'split-bench', name: 'Split Bench Seat', price: 100 },
  { id: 'reclining', name: 'Reclining Seat', price: 125 },
  { id: 'folding', name: 'Folding Seat', price: 80 },
];

// Item type options
export const itemTypeOptions: SeatOption[] = [
  { id: 'driver', name: 'Driver Seat', price: 0 },
  { id: 'passenger', name: 'Passenger Seat', price: 0 },
  { id: 'rear', name: 'Rear Seat', price: -25 },
  { id: 'middle', name: 'Middle Seat', price: -15 },
  { id: 'jump', name: 'Jump Seat', price: 40 },
  { id: 'auxiliary', name: 'Auxiliary Seat', price: 60 },
];

// Seat style options
export const seatStyleOptions: SeatOption[] = [
  { id: 'standard', name: 'Standard Style', price: 0 },
  { id: 'sport', name: 'Sport Style', price: 100 },
  { id: 'luxury', name: 'Luxury Style', price: 150 },
  { id: 'premium', name: 'Premium Style', price: 200 },
  { id: 'racing', name: 'Racing Style', price: 250 },
  { id: 'custom', name: 'Custom Style', price: 300 },
];

// Material type options
export const materialTypeOptions: SeatOption[] = [
  { id: 'fabric', name: 'Fabric Material', price: 0 },
  { id: 'leather', name: 'Leather Material', price: 200 },
  { id: 'suede', name: 'Suede Material', price: 150 },
  { id: 'vinyl', name: 'Vinyl Material', price: 50 },
  { id: 'mesh', name: 'Mesh Material', price: 75 },
  { id: 'hybrid', name: 'Hybrid Material', price: 125 },
];

// Included arm options
export const includedArmOptions: SeatOption[] = [
  { id: 'none', name: 'No Arm Included', price: 0 },
  { id: 'single', name: 'Single Arm Included', price: 50 },
  { id: 'double', name: 'Double Arms Included', price: 100 },
  { id: 'adjustable', name: 'Adjustable Arms Included', price: 150 },
  { id: 'folding', name: 'Folding Arms Included', price: 120 },
  { id: 'removable', name: 'Removable Arms Included', price: 80 },
];

// Extra arm options
export const extraArmOptions: SeatOption[] = [
  { id: 'none', name: 'No Extra Arms', price: 0 },
  { id: 'single', name: 'Single Extra Arm', price: 75 },
  { id: 'double', name: 'Double Extra Arms', price: 150 },
  { id: 'adjustable', name: 'Adjustable Extra Arms', price: 200 },
  { id: 'folding', name: 'Folding Extra Arms', price: 175 },
  { id: 'custom', name: 'Custom Extra Arms', price: 250 },
];