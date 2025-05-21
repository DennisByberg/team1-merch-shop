import axios from 'axios';
import { Order, INewOrder } from '../types/globalTypes';

const apiUrl: string = import.meta.env.VITE_API_URL;
const apiKey: string = import.meta.env.VITE_API_KEY;

export async function fetchOrders(): Promise<Order[]> {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'X-API-Key': apiKey,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.get<Order[]>(`${apiUrl}/api/orders`, {
    headers,
  });

  return response.data;
}

export async function fetchOrder(id: string): Promise<Order> {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'X-API-Key': apiKey,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.get<Order>(`${apiUrl}/api/orders/${id}`, {
    headers,
  });

  return response.data;
}

export async function createOrder(orderData: INewOrder): Promise<Order> {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'X-API-Key': apiKey,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.post<Order>(`${apiUrl}/api/orders`, orderData, {
    headers,
  });
  return response.data;
}

export async function updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'X-API-Key': apiKey,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.put<Order>(`${apiUrl}/api/orders/${id}`, orderData, {
    headers,
  });

  return response.data;
}

// TODO: addItemToOrder
