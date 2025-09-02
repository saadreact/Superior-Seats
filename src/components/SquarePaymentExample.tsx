'use client';

import React, { useState } from 'react';
import useSquareApi from '../hooks/useSquareApi';

// Example component showing how to use Square API integration
const SquarePaymentExample: React.FC = () => {
  const [amount, setAmount] = useState<number>(1000); // $10.00 in cents
  const [currency, setCurrency] = useState<string>('USD');
  
  const {
    loading,
    error,
    initializePayments,
    createPayment,
    createOrder,
    getSquareConfig,
    isSandboxMode,
    clearError
  } = useSquareApi();

  const handleInitializePayments = async () => {
    try {
      const config = await initializePayments(amount, currency);
      console.log('Square Payments initialized:', config);
      alert('Square Payments initialized successfully!');
    } catch (err) {
      console.error('Failed to initialize payments:', err);
    }
  };

  const handleCreateOrder = async () => {
    try {
      const orderData = {
        lineItems: [
          {
            name: 'Sample Product',
            quantity: '1',
            basePriceMoney: {
              amount: amount,
              currency: currency
            }
          }
        ]
      };

      const result = await createOrder(orderData);
      console.log('Order created:', result);
      alert('Order created successfully!');
    } catch (err) {
      console.error('Failed to create order:', err);
    }
  };

  const handleCreatePayment = async () => {
    try {
      // This is just an example - in real implementation, you'd get sourceId from Square Web Payments
      const paymentData = {
        sourceId: 'example_source_id',
        amount: amount,
        currency: currency
      };

      const result = await createPayment(paymentData);
      console.log('Payment created:', result);
      alert('Payment created successfully!');
    } catch (err) {
      console.error('Failed to create payment:', err);
    }
  };

  const handleGetConfig = () => {
    const config = getSquareConfig();
    console.log('Square Configuration:', config);
    alert(`Square Config:\nApp ID: ${config.applicationId}\nLocation: ${config.locationId}\nEnvironment: ${config.environment}`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Square API Integration</h2>
      
      {/* Environment Indicator */}
      <div className={`mb-4 p-3 rounded-lg text-center ${
        isSandboxMode() 
          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
          : 'bg-green-100 text-green-800 border border-green-300'
      }`}>
        <strong>Environment:</strong> {isSandboxMode() ? 'Sandbox (Testing)' : 'Production'}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg border border-red-300">
          <strong>Error:</strong> {error}
          <button 
            onClick={clearError}
            className="ml-2 text-red-600 hover:text-red-800 underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount (in cents)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="1000"
        />
        <p className="text-sm text-gray-500 mt-1">
          ${(amount / 100).toFixed(2)} {currency}
        </p>
      </div>

      {/* Currency Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Currency
        </label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="CAD">CAD</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleInitializePayments}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Initializing...' : 'Initialize Square Payments'}
        </button>

        <button
          onClick={handleCreateOrder}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Sample Order'}
        </button>

        <button
          onClick={handleCreatePayment}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Sample Payment'}
        </button>

        <button
          onClick={handleGetConfig}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
        >
          Get Square Configuration
        </button>
      </div>

      {/* Configuration Display */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Current Configuration</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>App ID:</strong> {getSquareConfig().applicationId}</p>
          <p><strong>Location ID:</strong> {getSquareConfig().locationId}</p>
          <p><strong>Environment:</strong> {getSquareConfig().environment}</p>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-blue-700">Usage Instructions</h3>
        <div className="text-sm text-blue-600 space-y-1">
          <p>• This component demonstrates Square API integration</p>
          <p>• Use the buttons to test different Square operations</p>
          <p>• Check the browser console for detailed responses</p>
          <p>• All operations use your sandbox environment</p>
        </div>
      </div>
    </div>
  );
};

export default SquarePaymentExample;
