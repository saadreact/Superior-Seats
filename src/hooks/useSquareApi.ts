import { useState, useCallback } from 'react';
import squareApiService from '../services/SquareApiService';
import { SquarePayment, SquareOrder, SquareCustomer } from '../services/SquareApiConfig';

// React hook for using Square API functionality
export const useSquareApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Square Web Payments
  const initializePayments = useCallback(async (amount: number, currency: string = 'USD') => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await squareApiService.initializeWebPayments(amount, currency);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payments';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a payment
  const createPayment = useCallback(async (paymentData: {
    sourceId: string;
    amount: number;
    currency: string;
    orderId?: string;
    customerId?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await squareApiService.createPayment(paymentData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create an order
  const createOrder = useCallback(async (orderData: {
    lineItems: Array<{
      name: string;
      quantity: string;
      basePriceMoney: {
        amount: number;
        currency: string;
      };
    }>;
    customerId?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await squareApiService.createOrder(orderData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get customer information
  const getCustomer = useCallback(async (customerId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await squareApiService.getCustomer(customerId);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get customer';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create or update customer
  const upsertCustomer = useCallback(async (customerData: {
    emailAddress: string;
    givenName?: string;
    familyName?: string;
    phoneNumber?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await squareApiService.upsertCustomer(customerData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upsert customer';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get OAuth URL
  const getOAuthUrl = useCallback(() => {
    return squareApiService.getOAuthUrl();
  }, []);

  // Check if in sandbox mode
  const isSandboxMode = useCallback(() => {
    return squareApiService.isSandboxMode();
  }, []);

  // Get Square configuration
  const getSquareConfig = useCallback(() => {
    return {
      applicationId: squareApiService.getApplicationId(),
      locationId: squareApiService.getLocationId(),
      environment: squareApiService.getEnvironment(),
    };
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    
    // Actions
    initializePayments,
    createPayment,
    createOrder,
    getCustomer,
    upsertCustomer,
    getOAuthUrl,
    isSandboxMode,
    getSquareConfig,
    clearError,
  };
};

export default useSquareApi;
