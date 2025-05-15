import axios from 'axios';
import { Product } from '../types/globalTypes';

// TODO: HIDE!
const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export async function fetchProduct(id: string) {
  const res = await axios.get<Product>(`${apiUrl}/api/products/${id}`, {
    headers: { 'X-API-Key': apiKey },
  });

  return res.data;
}

export async function fetchProducts() {
  const res = await axios.get<Product[]>(`${apiUrl}/api/products`, {
    headers: { 'X-API-Key': apiKey },
  });

  return res.data;
}

export async function addProduct(product: Omit<Product, 'id'>) {
  const res = await axios.post<Product>(`${apiUrl}/api/products`, product, {
    headers: { 'X-API-Key': apiKey },
  });

  return res.data;
}

export async function deleteProduct(id: string) {
  const res = await axios.delete(`${apiUrl}/api/products/${id}`, {
    headers: { 'X-API-Key': apiKey },
  });

  return res.data;
}

export async function updateProduct(id: string, product: Omit<Product, 'id'>) {
  const res = await axios.put<Product>(`${apiUrl}/api/products/${id}`, product, {
    headers: { 'X-API-Key': apiKey },
  });

  return res.data;
}
