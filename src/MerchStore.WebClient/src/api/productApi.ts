import axios from 'axios';
import { IProduct } from '../interfaces';
import { addProductToJinApi } from './External/jinApi';

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

// Adds a new product to both the local store and external Jin-API
export async function addProduct(product: Omit<IProduct, 'id'>) {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = { 'X-API-Key': apiKey };

  // Add authorization header if user is authenticated
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Create product in local store first
  const res = await axios.post<IProduct>(`${apiUrl}/api/products`, product, {
    headers,
  });

  // Sync product to external Jin-API
  await addProductToJinApi(product.name);

  // Return the local product data
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
