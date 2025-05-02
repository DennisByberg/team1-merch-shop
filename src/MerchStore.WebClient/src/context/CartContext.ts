import { createContext } from 'react';
import type { CartItem } from './CartProvider';
import { Product } from '../types/globalTypes';

export type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeItem: (id: string) => void;
  getTotalProductCount: () => number;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);
