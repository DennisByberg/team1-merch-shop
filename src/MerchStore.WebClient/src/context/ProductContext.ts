import { createContext } from 'react';
import { IProduct } from '../interfaces';

export type ProductContextType = {
  products: IProduct[];
  loading: boolean;
  addProduct?: (product: Omit<IProduct, 'id'>) => Promise<IProduct>;
  deleteProduct?: (id: string) => Promise<void>;
  updateProduct?: (id: string, product: Omit<IProduct, 'id'>) => Promise<IProduct>;
};

export const ProductContext = createContext<ProductContextType | undefined>(undefined);
