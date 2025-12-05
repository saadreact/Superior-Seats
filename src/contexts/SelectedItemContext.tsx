'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// TYPES: Define the structure for selected item (now only stores product ID)
export interface SelectedItem {
  id: number;
}

// TYPES: Define the structure for product variations
export interface ProductVariations {
  vehicle_trim?: VariationOption[];
  colors?: VariationOption[];
  material_types?: VariationOption[];
  heat_options?: VariationOption[];
  lumbar_types?: VariationOption[];
  recline_types?: VariationOption[];
  seat_stitch_patterns?: VariationOption[];
  arm_types?: VariationOption[];
  seat_types?: VariationOption[];
  seat_styles?: VariationOption[];
  item_types?: VariationOption[];
  relaxors?: VariationOption[];
}

// TYPES: Define the structure for individual variation options
export interface VariationOption {
  id: number;
  name: string;
  price?: number;
  image?: string;
  hex_code?: string;
  // Optional price adjustment string used by some APIs (e.g. variation price tiers)
  price_adjustment?: string;
  is_active?: boolean | null;
}

// CONTEXT INTERFACE: Define the context structure
interface SelectedItemContextType {
  selectedItem: SelectedItem | null;
  setSelectedItem: (item: SelectedItem | null) => void;
  clearSelectedItem: () => void;
}

// CONTEXT CREATION: Create the context with default values
const SelectedItemContext = createContext<SelectedItemContextType | undefined>(undefined);

// PROVIDER COMPONENT: Wraps app with selected item context
export const SelectedItemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  const clearSelectedItem = () => {
    setSelectedItem(null);
  };

  return (
    <SelectedItemContext.Provider value={{ selectedItem, setSelectedItem, clearSelectedItem }}>
      {children}
    </SelectedItemContext.Provider>
  );
};

// CUSTOM HOOK: Provides easy access to selected item context
export const useSelectedItem = () => {
  const context = useContext(SelectedItemContext);
  if (context === undefined) {
    throw new Error('useSelectedItem must be used within a SelectedItemProvider');
  }
  return context;
}; 