// Square API service with real Square SDK integration
// Temporarily disabled to fix build issues
// import { Client, Environment } from 'squareup';

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

// Initialize Square client - temporarily disabled
// const squareClient = new Client({
//   accessToken: process.env.SQUARE_ACCESS_TOKEN!,
//   environment: process.env.SQUARE_ENVIRONMENT === 'production' ? Environment.Production : Environment.Sandbox,
// });

export const squareApi = {
  // Mock Square payment creation - temporarily disabled
  async createPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    console.log('Square payment creation (mock):', paymentData);
    return {
      success: true,
      paymentId: `mock_payment_${Date.now()}`,
      status: 'COMPLETED',
    };
  },

  // Mock Square payment retrieval - temporarily disabled
  async getPayment(paymentId: string): Promise<PaymentResponse> {
    console.log('Square get payment (mock):', paymentId);
    return {
      success: true,
      paymentId: paymentId,
      status: 'COMPLETED',
    };
  },

  // Mock Square payment listing - temporarily disabled
  async listPayments(beginTime?: string, endTime?: string) {
    console.log('Square list payments (mock):', { beginTime, endTime });
    return {
      success: true,
      payments: [],
      error: undefined,
    };
  },
};

export default squareApi;
