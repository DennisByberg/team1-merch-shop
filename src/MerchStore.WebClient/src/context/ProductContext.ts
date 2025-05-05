import { createContext } from 'react';
import { Product } from '../types/globalTypes';

export type ProductContextType = {
  products: Product[];
  loading: boolean;
};

export const ProductContext = createContext<ProductContextType | undefined>(undefined);
