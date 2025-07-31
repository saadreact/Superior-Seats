// Contact information data
export const contactInfo = [
  {
    icon: 'Phone',
    title: 'Phone',
    details: [
      '+1 (555) 123-4567',
      'Mon-Fri: 8AM-6PM',
      'Sat: 9AM-4PM'
    ]
  },
  {
    icon: 'Email',
    title: 'Email',
    details: [
      'info@superiorseats.com',
      'support@superiorseats.com',
      'sales@superiorseats.com'
    ]
  },
  {
    icon: 'LocationOn',
    title: 'Address',
    details: [
      '123 Custom Seat Drive',
      'Automotive District',
      'Seattle, WA 98101'
    ]
  },
  {
    icon: 'AccessTime',
    title: 'Business Hours',
    details: [
      'Monday - Friday: 8AM-6PM',
      'Saturday: 9AM-4PM',
      'Sunday: Closed'
    ]
  }
];

// Form data interface
export interface ContactFormData {
  customerType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}

// Initial form data
export const initialFormData: ContactFormData = {
  customerType: 'retail',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: ''
}; 