import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { fetchOrder } from '../api/orderApi';
import { IOrder, IAdminOrderDetailView, INewOrderItem } from '../interfaces';

// Configuration constants
const DEFAULT_CURRENCY = 'SEK' as const;

// Helper function to transform order data
const transformOrderToDetailView = (fetchedOrder: IOrder): IAdminOrderDetailView => {
  const items = (fetchedOrder.orderProducts || []).map(
    (productItem: INewOrderItem, index: number) => ({
      orderItemId: `${fetchedOrder.id}-item-${index}`,
      productId: productItem.productId,
      productName: productItem.productName,
      quantity: productItem.quantity,
      unitPrice: productItem.unitPrice,
      lineItemTotalPrice: productItem.quantity * productItem.unitPrice,
      currency: DEFAULT_CURRENCY,
    })
  );

  // Calculate total order amount
  const totalOrderAmount = items.reduce((sum, item) => sum + item.lineItemTotalPrice, 0);

  return {
    id: fetchedOrder.id,
    fullName: fetchedOrder.fullName,
    email: fetchedOrder.email,
    street: fetchedOrder.street,
    postalCode: fetchedOrder.postalCode,
    city: fetchedOrder.city,
    country: fetchedOrder.country,
    orderStatus: fetchedOrder.orderStatus,
    items,
    totalOrderAmount,
    currency: DEFAULT_CURRENCY,
  };
};

// Helper function to get error message
const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : 'An unknown error occurred.';
};

export function useFetchOrderDetails(orderId: string | undefined) {
  const [order, setOrder] = useState<IAdminOrderDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderData = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const fetchedOrder = await fetchOrder(id);
      const orderDetailView = transformOrderToDetailView(fetchedOrder);
      setOrder(orderDetailView);
    } catch (err) {
      console.error('Failed to fetch order details in hook:', err);
      const errorMessage = getErrorMessage(err);
      setError(`Failed to load order details: ${errorMessage}`);
      toast.error('Failed to load order details.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchOrder = useCallback(() => {
    if (orderId) {
      fetchOrderData(orderId);
    }
  }, [orderId, fetchOrderData]);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is missing.');
      setLoading(false);
      setOrder(null);
      return;
    }

    fetchOrderData(orderId);
  }, [orderId, fetchOrderData]);

  return { order, loading, error, refetchOrder };
}
