// Contact information data
export const contactInfo = [
  {
    icon: 'Phone',
    title: 'Phone',
    details: [
      '+1 574-389-9011',
      'Mon-Fri: 8AM-6PM',
      'Sat: closed',
      'Sun: Closed'
    ]
  },
  {
    icon: 'Email',
    title: 'Email',
    details: [
      'info@superiorseatingllc.com',
      'support@superiorseats.com',
      'sales@superiorseats.com'
    ]
  },
  {
    icon: 'LocationOn',
    title: 'Address',
    details: [
      '21468 C Street Elkhart, IN',
      'United States',
      'Indiana 46516'
    ]
  },
  {
    icon: 'AccessTime',
    title: 'Business Hours',
    details: [
      'Monday - Friday: 8AM-6PM',
      'Saturday: closed',
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