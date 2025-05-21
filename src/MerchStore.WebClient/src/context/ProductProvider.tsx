import { useEffect, useState, ReactNode } from 'react';
import {
  fetchProducts,
  addProduct as apiAddProduct,
  deleteProduct as apiDeleteProduct,
  updateProduct as apiUpdateProduct,
} from '../api/productApi';
import { IProduct } from '../interfaces';
import { ProductContext } from './ProductContext';

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  async function addProduct(product: Omit<IProduct, 'id'>) {
    const created = await apiAddProduct(product);
    setProducts((prev) => [...prev, created]);

    return created;
  }

  async function deleteProduct(id: string) {
    await apiDeleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function updateProduct(id: string, product: Omit<IProduct, 'id'>) {
    const updated = await apiUpdateProduct(id, product);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }

  return (
    <ProductContext.Provider
      value={{ products, loading, addProduct, deleteProduct, updateProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}
