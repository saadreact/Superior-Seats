// Contact information data
export const contactInfo = [
  {
    icon: 'Phone',
    title: 'Phone',
    details: [
      '+1 574-389-9011',
      
     
      
    ]
  },
  {
    icon: 'Email',
    title: 'Email',
    details: [
      'info@superiorseatingllc.com',
      
    ]
  },
  {
    icon: 'LocationOn',
    title: 'Address',
    details: [
      '21468 C Street',
      'Elkhart, IN 46516',
      'U.S.A.'
    ]
  },
  {
    icon: 'AccessTime',
    title: 'Business Hours',
    details: [
      'Tuesday - Friday: 7AM-5PM',
      'Saturday - Sunday: closed',
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