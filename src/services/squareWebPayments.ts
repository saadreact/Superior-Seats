// Square Web Payments SDK integration
// Note: Square Web Payments SDK is loaded via script tag in the HTML
declare global {
  interface Window {
    Square?: any;
  }
}

export interface SquareConfig {
  applicationId: string;
  locationId: string;
  environment: 'sandbox' | 'production';
}

export interface SquarePaymentRequest {
  amount: number; // Amount in cents
  currency: string;
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

export interface SquarePaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
  status?: string;
}

class SquareWebPaymentsService {
  private payments: any = null;
  private config: SquareConfig | null = null;

  async initialize(config: SquareConfig): Promise<void> {
    try {
      this.config = config;
      
      // Load Square Web Payments SDK dynamically
      if (!window.Square) {
        await this.loadSquareSDK();
      }
      
      this.payments = window.Square.payments({
        applicationId: config.applicationId,
        locationId: config.locationId,
        environment: config.environment,
      });

      console.log('Square Web Payments SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Square Web Payments SDK:', error);
      throw new Error('Failed to initialize payment system');
    }
  }

  private loadSquareSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.Square) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://web.squarecdn.com/v1/square.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Square SDK'));
      document.head.appendChild(script);
    });
  }

  async createCardPayment(
    cardElement: any,
    paymentRequest: SquarePaymentRequest
  ): Promise<SquarePaymentResult> {
    if (!this.payments) {
      throw new Error('Square Web Payments SDK not initialized');
    }

    try {
      const result = await this.payments.confirmPayment({
        paymentRequest: {
          amountMoney: {
            amount: paymentRequest.amount,
            currency: paymentRequest.currency,
          },
          buyerEmailAddress: paymentRequest.buyerEmailAddress,
          billingAddress: paymentRequest.billingAddress,
        },
        sourceId: cardElement,
      });

      if (result.status === 'SUCCESS') {
        return {
          success: true,
          paymentId: result.payment?.id,
          status: result.payment?.status,
        };
      } else {
        return {
          success: false,
          error: result.errors?.[0]?.detail || 'Payment failed',
        };
      }
    } catch (error: any) {
      console.error('Square payment error:', error);
      return {
        success: false,
        error: error.message || 'Payment processing failed',
      };
    }
  }

  async createApplePayPayment(
    paymentRequest: SquarePaymentRequest
  ): Promise<SquarePaymentResult> {
    if (!this.payments) {
      throw new Error('Square Web Payments SDK not initialized');
    }

    try {
      const result = await this.payments.confirmPayment({
        paymentRequest: {
          amountMoney: {
            amount: paymentRequest.amount,
            currency: paymentRequest.currency,
          },
          buyerEmailAddress: paymentRequest.buyerEmailAddress,
          billingAddress: paymentRequest.billingAddress,
        },
        sourceId: 'apple_pay',
      });

      if (result.status === 'SUCCESS') {
        return {
          success: true,
          paymentId: result.payment?.id,
          status: result.payment?.status,
        };
      } else {
        return {
          success: false,
          error: result.errors?.[0]?.detail || 'Apple Pay payment failed',
        };
      }
    } catch (error: any) {
      console.error('Apple Pay payment error:', error);
      return {
        success: false,
        error: error.message || 'Apple Pay processing failed',
      };
    }
  }

  async createGooglePayPayment(
    paymentRequest: SquarePaymentRequest
  ): Promise<SquarePaymentResult> {
    if (!this.payments) {
      throw new Error('Square Web Payments SDK not initialized');
    }

    try {
      const result = await this.payments.confirmPayment({
        paymentRequest: {
          amountMoney: {
            amount: paymentRequest.amount,
            currency: paymentRequest.currency,
          },
          buyerEmailAddress: paymentRequest.buyerEmailAddress,
          billingAddress: paymentRequest.billingAddress,
        },
        sourceId: 'google_pay',
      });

      if (result.status === 'SUCCESS') {
        return {
          success: true,
          paymentId: result.payment?.id,
          status: result.payment?.status,
        };
      } else {
        return {
          success: false,
          error: result.errors?.[0]?.detail || 'Google Pay payment failed',
        };
      }
    } catch (error: any) {
      console.error('Google Pay payment error:', error);
      return {
        success: false,
        error: error.message || 'Google Pay processing failed',
      };
    }
  }

  isApplePayAvailable(): boolean {
    if (!this.payments) return false;
    return this.payments.applePay?.isAvailable() || false;
  }

  isGooglePayAvailable(): boolean {
    if (!this.payments) return false;
    return this.payments.googlePay?.isAvailable() || false;
  }

  getCardElement() {
    if (!this.payments) {
      throw new Error('Square Web Payments SDK not initialized');
    }
    return this.payments.card();
  }

  getApplePayButton() {
    if (!this.payments) {
      throw new Error('Square Web Payments SDK not initialized');
    }
    return this.payments.applePay();
  }

  getGooglePayButton() {
    if (!this.payments) {
      throw new Error('Square Web Payments SDK not initialized');
    }
    return this.payments.googlePay();
  }
}

// Export singleton instance
export const squareWebPayments = new SquareWebPaymentsService();
export default squareWebPayments;
