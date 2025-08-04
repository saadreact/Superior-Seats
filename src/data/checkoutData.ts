// Checkout form data and constants

export interface Country {
  value: string;
  label: string;
  code: string;
}

export const countries: Country[] = [
  { value: 'United States', label: 'United States', code: 'US' },
  { value: 'Canada', label: 'Canada', code: 'CA' },
  { value: 'United Kingdom', label: 'United Kingdom', code: 'GB' },
  { value: 'Australia', label: 'Australia', code: 'AU' },
  { value: 'Germany', label: 'Germany', code: 'DE' },
  { value: 'France', label: 'France', code: 'FR' },
  { value: 'Japan', label: 'Japan', code: 'JP' },
  { value: 'Mexico', label: 'Mexico', code: 'MX' },
  { value: 'India', label: 'India', code: 'IN' },
  { value: 'Brazil', label: 'Brazil', code: 'BR' },
  { value: 'China', label: 'China', code: 'CN' },
  { value: 'South Korea', label: 'South Korea', code: 'KR' },
  { value: 'Italy', label: 'Italy', code: 'IT' },
  { value: 'Spain', label: 'Spain', code: 'ES' },
  { value: 'Netherlands', label: 'Netherlands', code: 'NL' },
];

export interface PaymentMethod {
  value: string;
  label: string;
  description: string;
  icon: string;
}

export const paymentMethods: PaymentMethod[] = [
  {
    value: 'square',
    label: 'Square Payment',
    description: 'Secure payment processing with Square',
    icon: '💳'
  }
];

export interface ShippingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentFormData {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

// Default form values
export const defaultShippingData: ShippingFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States'
};

export const defaultPaymentData: PaymentFormData = {
  cardNumber: '',
  cardHolderName: '',
  expiryDate: '',
  cvv: '',
  saveCard: false
};

// Shipping calculation constants
export const SHIPPING_THRESHOLD = 500; // Free shipping above this amount
export const SHIPPING_COST = 29.99; // Standard shipping cost
export const TAX_RATE = 0.08; // 8% tax rate

// Form validation messages
export const validationMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  cardNumber: 'Please enter a valid card number',
  expiryDate: 'Please enter a valid expiry date (MM/YY)',
  cvv: 'Please enter a valid CVV',
}; 