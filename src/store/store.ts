import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';

// Persist configuration for auth
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated'], // Only persist these fields
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Store configuration
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
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