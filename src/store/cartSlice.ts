import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  title: string;
  price: string;
  image: string;
  description: string;
  category: string;
  subCategory?: string;
  mainCategory?: string;
  quantity: number;
  stock?: number; // Add stock to track inventory limits
  // Optional: preserve variant selections from customization
  variants?: any;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        // Check stock limit before incrementing
        const stock = action.payload.stock ?? existingItem.stock;
        if (stock !== undefined && stock !== null && existingItem.quantity >= stock) {
          // Don't add more if we've reached stock limit
          return;
        }
        existingItem.quantity += 1;
        // Update stock if provided in payload
        if (action.payload.stock !== undefined) {
          existingItem.stock = action.payload.stock;
        }
      } else {
        // Add new item with stock info
        state.items.push({ ...action.payload, quantity: 1, stock: action.payload.stock });
      }

      state.totalItems = state.items.length;
      state.totalPrice = state.items.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[$,]/g, ''));
        return sum + (price * item.quantity);
      }, 0);
    },

    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);

      state.totalItems = state.items.length;
      state.totalPrice = state.items.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[$,]/g, ''));
        return sum + (price * item.quantity);
      }, 0);
    },

    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number; stock?: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        // Update stock if provided
        if (action.payload.stock !== undefined) {
          item.stock = action.payload.stock;
        }
        
        // Enforce stock limit
        const stock = item.stock;
        if (stock !== undefined && stock !== null && action.payload.quantity > stock) {
          item.quantity = stock; // Cap at stock limit
        } else {
          item.quantity = action.payload.quantity;
        }

        state.totalItems = state.items.length;
        state.totalPrice = state.items.reduce((sum, item) => {
          const price = parseFloat(item.price.replace(/[$,]/g, ''));
          return sum + (price * item.quantity);
        }, 0);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
