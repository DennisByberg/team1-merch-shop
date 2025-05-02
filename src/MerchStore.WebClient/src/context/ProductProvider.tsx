import { useEffect, useState, ReactNode } from 'react';
import { fetchProducts } from '../api/productApi';
import { Product } from '../types/globalTypes';
import { ProductContext } from './ProductContext';

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
}
