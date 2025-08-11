// Simulated Square API service for development
// In production, replace with actual Square SDK integration

export interface PaymentRequest {
  sourceId: string;
  idempotencyKey: string;
  amountMoney: {
    amount: number; // Amount in cents
    currency: string;
  };
  locationId: string;
  buyerEmailAddress?: string;
  billingAddress?: {
    addressLine1?: string;
    addressLine2?: string;
    locality?: string;
    administrativeDistrictLevel1?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  error?: string;
  status?: string;
}

export const squareApi = {
  // Simulated payment creation
  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful payment
      const paymentId = `sim_payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        paymentId: paymentId,
        status: 'COMPLETED',
      };
    } catch (error: any) {
      console.error('Simulated Square payment error:', error);
      return {
        success: false,
        error: 'Simulated payment processing failed',
      };
    }
  },

  // Simulated payment retrieval
  async getPayment(paymentId: string): Promise<PaymentResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        paymentId: paymentId,
        status: 'COMPLETED',
      };
    } catch (error: any) {
      console.error('Simulated Square get payment error:', error);
      return {
        success: false,
        error: 'Failed to retrieve simulated payment',
      };
    }
  },

  // Simulated payment listing
  async listPayments(beginTime?: string, endTime?: string) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        payments: [
          {
            id: 'sim_payment_1',
            status: 'COMPLETED',
            amountMoney: { amount: 1000, currency: 'USD' },
            createdAt: new Date().toISOString(),
          },
          {
            id: 'sim_payment_2',
            status: 'COMPLETED',
            amountMoney: { amount: 2500, currency: 'USD' },
            createdAt: new Date().toISOString(),
          },
        ],
      };
    } catch (error: any) {
      console.error('Simulated Square list payments error:', error);
      return {
        success: false,
        error: 'Failed to list simulated payments',
      };
    }
  },
};

export default squareApi;
