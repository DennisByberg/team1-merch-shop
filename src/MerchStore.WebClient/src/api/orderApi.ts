import axios from 'axios';
import { IOrder, INewOrder } from '../interfaces';

const apiUrl: string = import.meta.env.VITE_API_URL;
const apiKey: string = import.meta.env.VITE_API_KEY;

export async function getOrders(): Promise<IOrder[]> {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'X-API-Key': apiKey,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.get<IOrder[]>(`${apiUrl}/api/orders`, {
    headers,
  });

  return response.data;
}

export async function fetchOrder(id: string): Promise<IOrder> {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'X-API-Key': apiKey,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.get<IOrder>(`${apiUrl}/api/orders/${id}`, {
    headers,
  });

  return response.data;
}

export async function createOrder(orderData: INewOrder): Promise<IOrder> {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'X-API-Key': apiKey,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.post<IOrder>(`${apiUrl}/api/orders`, orderData, {
    headers,
  });
  return response.data;
}

export async function updateOrder(
  id: string,
  orderData: Partial<IOrder>
): Promise<IOrder> {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'X-API-Key': apiKey,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.put<IOrder>(`${apiUrl}/api/orders/${id}`, orderData, {
    headers,
  });

  return response.data;
}

// TODO: addItemToOrder
