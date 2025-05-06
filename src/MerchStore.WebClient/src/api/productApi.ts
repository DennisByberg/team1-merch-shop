import axios from 'axios';
import { Product } from '../types/globalTypes';

const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = 'API_KEY';

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
