import { createContext } from 'react';
import type { CartItem } from './CartProvider';
import { IProduct } from '../interfaces';

export type CartContextType = {
  items: CartItem[];
  addToCart: (product: IProduct) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeItem: (id: string) => void;
  getTotalProductCount: () => number;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);
