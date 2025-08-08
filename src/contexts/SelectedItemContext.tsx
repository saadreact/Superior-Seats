'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// TYPES: Define the structure for selected item
export interface SelectedItem {
  id: number;
  title: string;
  category: string;
  subCategory: string;
  mainCategory: string;
  image: string;
  description: string;
  price: string;
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