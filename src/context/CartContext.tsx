import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/data/mockData';

export type CartItem = {
  product: Product;
  variant: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, variant: string, quantity: number) => void;
  removeFromCart: (productId: number, variant: string) => void;
  updateQuantity: (productId: number, variant: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, variant: string, quantity: number) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (item) => item.product.id === product.id && item.variant === variant
      );
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id && item.variant === variant
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, variant, quantity }];
    });
  };

  const removeFromCart = (productId: number, variant: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.variant === variant))
    );
  };

  const updateQuantity = (productId: number, variant: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.variant === variant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
