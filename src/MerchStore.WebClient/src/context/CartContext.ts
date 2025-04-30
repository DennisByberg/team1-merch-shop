import { createContext } from 'react';
import type { CartItem } from './CartProvider';
import { Product } from '../types/globalTypes';

export type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  getTotalProductCount: () => number;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);
