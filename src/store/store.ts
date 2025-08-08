import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import { CartItem } from './cartSlice';

// Persist configuration for auth
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated'], // Only persist these fields
};

// Persist configuration for cart
const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items', 'totalItems', 'totalPrice'], // Persist all cart fields
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

// Store configuration
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
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