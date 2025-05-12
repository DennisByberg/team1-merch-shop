import axios from 'axios';
import { Product } from '../types/globalTypes';

// TODO: HIDE!
const apiUrl =
  'https://merchstorebackend.agreeabledesert-a7938720.swedencentral.azurecontainerapps.io/';
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
