import axios, { AxiosResponse, AxiosError } from 'axios';

// API base URL - can be configured via environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;

// Contact form data interface
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}

// API response interface
export interface ContactApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Error response interface
export interface ContactApiError {
  message: string;
  status?: number;
  code?: string;
}

// Contact API service class
export class ContactPageAPI {
  private static instance: ContactPageAPI;
  private readonly timeout = 15000; // Increased to 15 seconds


  private constructor() {}

  // Singleton pattern
  public static getInstance(): ContactPageAPI {
    if (!ContactPageAPI.instance) {
      ContactPageAPI.instance = new ContactPageAPI();
    }
    return ContactPageAPI.instance;
  }

  // Send contact form data
  public async sendContactForm(formData: ContactFormData): Promise<ContactApiResponse> {
    try {
      // Transform camelCase to snake_case for database compatibility
      const transformedData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        subject: formData.subject,
        message: formData.message,
      };

      console.log('📧 Sending contact form to:', `${API_BASE_URL}/contact`);
      console.log('📧 Contact form data:', transformedData);

      // Try the contact endpoint first
      let response: AxiosResponse<ContactApiResponse> | undefined;
      
      try {
        response = await axios.post(
          `${API_BASE_URL}/contact`,
          transformedData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: this.timeout,
          }
        );
      } catch (endpointError) {
        // If contact endpoint doesn't exist, try alternative endpoints
        console.log('📧 Contact endpoint failed, trying alternative endpoints...');
        
        // Try sending as a general message or inquiry
        const alternativeData = {
          ...transformedData,
          type: 'contact_form',
          source: 'website'
        };
        
        // Try different possible endpoints
        const possibleEndpoints = ['/messages', '/inquiries', '/support', '/feedback'];
        
        for (const endpoint of possibleEndpoints) {
          try {
            console.log(`📧 Trying endpoint: ${endpoint}`);
            response = await axios.post(
              `${API_BASE_URL}${endpoint}`,
              alternativeData,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                timeout: this.timeout,
              }
            );
            console.log(`📧 Success with endpoint: ${endpoint}`);
            break;
          } catch (altError) {
            console.log(`📧 Endpoint ${endpoint} failed:`, altError);
            if (endpoint === possibleEndpoints[possibleEndpoints.length - 1]) {
              // If all alternative endpoints fail, throw the original error
              throw endpointError;
            }
          }
        }
      }

      if (!response) {
        throw new Error('No response received from any endpoint');
      }

      console.log('📧 Contact form response:', response.data);

      return {
        success: true,
        message: 'Message sent successfully',
        data: response.data,
      };
    } catch (error) {
      console.error('📧 Contact API failed:', error);
      const errorResult = this.handleError(error);
      
      // If all API endpoints fail, provide a fallback option
      if (errorResult.code === 'NETWORK_ERROR' || errorResult.status === 404) {
        return {
          success: false,
          message: `API endpoint not available. Please contact us directly at support@superiorseats.com or call us at (555) 123-4567. Your message: "${formData.subject}"`,
          data: { 
            status: errorResult.status, 
            code: errorResult.code,
            fallback: true,
            email: 'support@superiorseats.com',
            phone: '(555) 123-4567'
          }
        };
      }
      
      return {
        success: false,
        message: errorResult.message,
        data: { status: errorResult.status, code: errorResult.code }
      };
    }
  }

  // Handle different types of errors
  private handleError(error: unknown): ContactApiError {
    console.error('Contact API Error:', error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      // Handle network errors (most common)
      if (axiosError.code === 'ERR_NETWORK' || axiosError.message.includes('Network Error')) {
        return {
          message: 'Network connection failed. Please check your internet connection and try again. If the problem persists, please contact support.',
          code: 'NETWORK_ERROR',
        };
      }
      
      // Handle timeout errors
      if (axiosError.code === 'ECONNABORTED') {
        return {
          message: 'Request timeout. The server is taking too long to respond. Please try again.',
          code: 'ECONNABORTED',
        };
      }

      // Handle response errors
      if (axiosError.response) {
        const status = axiosError.response.status;
        const statusText = axiosError.response.statusText;
        
        return {
          message: this.getErrorMessageByStatus(status),
          status,
          code: statusText,
        };
      }

      // Handle request errors (no response received)
      if (axiosError.request) {
        return {
          message: 'Unable to reach the server. Please check your internet connection and try again.',
          code: 'NO_RESPONSE',
        };
      }
    }

    // Handle unknown errors
    return {
      message: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
      code: 'UNKNOWN_ERROR',
    };
  }

  // Get user-friendly error messages based on HTTP status codes
  private getErrorMessageByStatus(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid data provided. Please check your information and try again.';
      case 401:
        return 'Authentication failed. Please try again.';
      case 403:
        return 'Access denied. Please try again later.';
      case 404:
        return 'Contact service not found. Please try again later or contact support.';
      case 409:
        return 'Conflict with existing data. Please check your information.';
      case 422:
        return 'Validation failed. Please check your input data.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Internal server error. Please try again later or contact support.';
      case 502:
        return 'Bad gateway. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      case 504:
        return 'Gateway timeout. Please try again later.';
      default:
        if (status >= 500) {
          return 'Server error. Please try again later or contact support.';
        } else if (status >= 400) {
          return 'Client error. Please check your request and try again.';
        } else {
          return `Unexpected error (${status}). Please try again.`;
        }
    }
  }


}

// Export singleton instance
export const contactPageAPI = ContactPageAPI.getInstance();

// Export convenience functions
export const sendContactForm = (formData: ContactFormData) => 
  contactPageAPI.sendContactForm(formData);
