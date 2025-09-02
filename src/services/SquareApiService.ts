import { SQUARE_CONFIG, SquarePayment, SquareOrder, SquareCustomer, SquareApiResponse, getSquareOAuthUrl, isSquareSandbox } from './SquareApiConfig';

// Square API Service Class
// Handles all Square API operations for the frontend
export class SquareApiService {
  private baseUrl: string;
  private applicationId: string;
  private locationId: string;

  constructor() {
    this.baseUrl = SQUARE_CONFIG.API_BASE_URL;
    this.applicationId = SQUARE_CONFIG.APPLICATION_ID;
    this.locationId = SQUARE_CONFIG.LOCATION_ID;
  }

  /**
   * Initialize Square Web Payments
   * @param amount - Payment amount in cents
   * @param currency - Currency code (e.g., 'USD')
   * @returns Promise with payment form initialization
   */
  async initializeWebPayments(amount: number, currency: string = 'USD') {
    try {
      // This would typically be called from your backend
      // For now, we'll return the configuration needed
      return {
        applicationId: this.applicationId,
        locationId: this.locationId,
        amount: amount,
        currency: currency,
        environment: SQUARE_CONFIG.ENVIRONMENT
      };
    } catch (error) {
      console.error('Error initializing Square Web Payments:', error);
      throw error;
    }
  }

  /**
   * Create a payment using Square Web Payments
   * @param paymentData - Payment information
   * @returns Promise with payment result
   */
  async createPayment(paymentData: {
    sourceId: string;
    amount: number;
    currency: string;
    orderId?: string;
    customerId?: string;
  }): Promise<SquareApiResponse<SquarePayment>> {
    try {
      // This would typically be a call to your backend API
      // which then calls Square's API with the secret key
      const response = await fetch('/api/square/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  /**
   * Create an order in Square
   * @param orderData - Order information
   * @returns Promise with order result
   */
  async createOrder(orderData: {
    lineItems: Array<{
      name: string;
      quantity: string;
      basePriceMoney: {
        amount: number;
        currency: string;
      };
    }>;
    customerId?: string;
  }): Promise<SquareApiResponse<SquareOrder>> {
    try {
      const response = await fetch('/api/square/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderData,
          locationId: this.locationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Get customer information
   * @param customerId - Square customer ID
   * @returns Promise with customer data
   */
  async getCustomer(customerId: string): Promise<SquareApiResponse<SquareCustomer>> {
    try {
      const response = await fetch(`/api/square/customers/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting customer:', error);
      throw error;
    }
  }

  /**
   * Create or update customer
   * @param customerData - Customer information
   * @returns Promise with customer result
   */
  async upsertCustomer(customerData: {
    emailAddress: string;
    givenName?: string;
    familyName?: string;
    phoneNumber?: string;
  }): Promise<SquareApiResponse<SquareCustomer>> {
    try {
      const response = await fetch('/api/square/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error upserting customer:', error);
      throw error;
    }
  }

  /**
   * Get OAuth URL for Square Connect
   * @returns OAuth authorization URL
   */
  getOAuthUrl(): string {
    return getSquareOAuthUrl();
  }

  /**
   * Check if Square is in sandbox mode
   * @returns boolean indicating sandbox mode
   */
  isSandboxMode(): boolean {
    return isSquareSandbox();
  }

  /**
   * Get Square application ID
   * @returns Square application ID
   */
  getApplicationId(): string {
    return this.applicationId;
  }

  /**
   * Get Square location ID
   * @returns Square location ID
   */
  getLocationId(): string {
    return this.locationId;
  }

  /**
   * Get Square environment
   * @returns Square environment (sandbox or production)
   */
  getEnvironment(): string {
    return SQUARE_CONFIG.ENVIRONMENT;
  }
}

// Export singleton instance
const squareApiService = new SquareApiService();
export default squareApiService;
