import axios from 'axios';
import { IProduct } from '../interfaces';

const apiUrl: string = import.meta.env.VITE_API_URL;
const apiKey: string = import.meta.env.VITE_API_KEY;

export async function fetchProducts() {
  const res = await axios.get<IProduct[]>(`${apiUrl}/api/products`, {
    headers: { 'X-API-Key': apiKey },
  });

  return res.data;
}

export async function fetchProduct(id: string) {
  const res = await axios.get<IProduct>(`${apiUrl}/api/products/${id}`, {
    headers: { 'X-API-Key': apiKey },
  });

  return res.data;
}

export async function addProduct(product: Omit<IProduct, 'id'>) {
  const token = localStorage.getItem('accessToken');
  console.log(token);
  const headers: Record<string, string> = { 'X-API-Key': apiKey };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await axios.post<IProduct>(`${apiUrl}/api/products`, product, {
    headers,
  });

  return res.data;
}

export async function deleteProduct(id: string) {
  const token = localStorage.getItem('accessToken'); // Hämta token från localStorage
  const headers: Record<string, string> = { 'X-API-Key': apiKey };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await axios.delete(`${apiUrl}/api/products/${id}`, {
    headers,
  });

  return res.data;
}

export async function updateProduct(id: string, product: Omit<IProduct, 'id'>) {
  const token = localStorage.getItem('accessToken'); // Hämta token från localStorage
  const headers: Record<string, string> = { 'X-API-Key': apiKey };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await axios.put<IProduct>(`${apiUrl}/api/products/${id}`, product, {
    headers,
  });

  return res.data;
}
