import { createContext } from 'react';
import { Product } from '../types/globalTypes';

export type ProductContextType = {
  products: Product[];
  loading: boolean;
  addProduct?: (product: Omit<Product, 'id'>) => Promise<Product>;
  deleteProduct?: (id: string) => Promise<void>;
  updateProduct?: (id: string, product: Omit<Product, 'id'>) => Promise<Product>;
};

export const ProductContext = createContext<ProductContextType | undefined>(undefined);
