// Square API Configuration for Frontend
// This file contains all Square API related configuration and constants

export const SQUARE_CONFIG = {
  // Base URLs
  CONNECT_URL: process.env.NEXT_PUBLIC_SQUARE_CONNECT_URL || 'https://connect.squareupsandbox.com/',
  
  // Application credentials (public ones only)
  APPLICATION_ID: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || 'sandbox-sq0idb-5-Fq9kX2vcQTojh9kXpx8g',
  
  // Environment
  ENVIRONMENT: process.env.NEXT_PUBLIC_SQUARE_ENVIROMENT || 'sandbox',
  
  // Location
  LOCATION_ID: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || 'LKAK5DG45H6SE',
  
  // API endpoints
  API_BASE_URL: 'https://connect.squareupsandbox.com',
  
  // OAuth endpoints
  OAUTH_AUTHORIZE_URL: 'https://connect.squareupsandbox.com/oauth2/authorize',
  OAUTH_TOKEN_URL: 'https://connect.squareupsandbox.com/oauth2/token',
  
  // Web Payment endpoints
  PAYMENTS_API_URL: 'https://connect.squareupsandbox.com/v2/payments',
  ORDERS_API_URL: 'https://connect.squareupsandbox.com/v2/orders',
  CATALOG_API_URL: 'https://connect.squareupsandbox.com/v2/catalog',
  
  // Webhook endpoints
  WEBHOOK_URL: '/api/square/webhooks',
  
  // Scopes for OAuth
  SCOPES: [
    'MERCHANT_PROFILE_READ',
    'PAYMENTS_READ',
    'PAYMENTS_WRITE',
    'ORDERS_READ',
    'ORDERS_WRITE',
    'CUSTOMERS_READ',
    'CUSTOMERS_WRITE',
    'ITEMS_READ',
    'ITEMS_WRITE'
  ].join(' '),
  
  // Redirect URI for OAuth - IMPORTANT: This must match what's configured in Square Connect
  // Update this in your Square Connect application settings to match your domain
  REDIRECT_URI: typeof window !== 'undefined' 
    ? `${window.location.origin}/api/auth/square/callback`
    : 'https://superiorseats.ali-khalid.com/api/auth/square/callback'
};

// Square API response types
export interface SquarePayment {
  id: string;
  amount_money: {
    amount: number;
    currency: string;
  };
  status: string;
  created_at: string;
  updated_at: string;
  order_id?: string;
  customer_id?: string;
}

export interface SquareOrder {
  id: string;
  location_id: string;
  line_items: Array<{
    name: string;
    quantity: string;
    base_price_money: {
      amount: number;
      currency: string;
    };
  }>;
  total_money: {
    amount: number;
    currency: string;
  };
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SquareCustomer {
  id: string;
  email_address: string;
  given_name?: string;
  family_name?: string;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

// Square API error types
export interface SquareApiError {
  code: string;
  message: string;
  category: string;
}

// Square API response wrapper
export interface SquareApiResponse<T> {
  data?: T;
  errors?: SquareApiError[];
}

// Helper functions
export const isSquareSandbox = (): boolean => {
  return SQUARE_CONFIG.ENVIRONMENT === 'sandbox';
};

export const getSquareApiUrl = (endpoint: string): string => {
  return `${SQUARE_CONFIG.API_BASE_URL}${endpoint}`;
};

export const getSquareOAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: SQUARE_CONFIG.APPLICATION_ID,
    scope: SQUARE_CONFIG.SCOPES,
    response_type: 'code',
    redirect_uri: SQUARE_CONFIG.REDIRECT_URI,
    state: Math.random().toString(36).substring(7) // Random state for security
  });
  
  return `${SQUARE_CONFIG.OAUTH_AUTHORIZE_URL}?${params.toString()}`;
};

// Export default config
export default SQUARE_CONFIG;
