import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import { CartItem } from './cartSlice';
import squareReducer from './squareSlice';

// Create a noop storage for SSR (server-side rendering)
// This prevents the "failed to create sync storage" warning
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Use real storage on client, noop storage on server
const persistStorage = typeof window !== 'undefined' 
  ? storage 
  : createNoopStorage();

// Persist configuration for auth
const authPersistConfig = {
  key: 'auth',
  storage: persistStorage,
  whitelist: ['user', 'token', 'isAuthenticated'], // Only persist these fields
};

// Persist configuration for cart
const cartPersistConfig = {
  key: 'cart',
  storage: persistStorage,
  whitelist: ['items', 'totalItems', 'totalPrice'], // Persist all cart fields
};

// Persist configuration for square
const squarePersistConfig = {
  key: 'square',
  storage: persistStorage,
  whitelist: ['connected', 'merchantId', 'locationId', 'environment'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedSquareReducer = persistReducer(squarePersistConfig, squareReducer);

// Store configuration
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
    square: persistedSquareReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Type for cart state to help with TypeScript
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Create a client-side only store
let clientStore: typeof store | undefined;
let clientPersistor: typeof persistor | undefined;

export function getStore() {
  if (typeof window === 'undefined') {
    return { store, persistor };
  }
  
  if (!clientStore) {
    clientStore = store;
    clientPersistor = persistor;
  }
  
  return { store: clientStore, persistor: clientPersistor };
} 