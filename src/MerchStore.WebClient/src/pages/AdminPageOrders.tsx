import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumbs from '../components/PageBreadcrumbs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OrderAdminTable, { IAdminOrderRow } from '../components/Admin/OrderAdminTable';
import OrderCreateDialog from '../components/Admin/OrderCreateDialog';
import { useEffect, useState, useCallback } from 'react';
import { createOrder, getOrders } from '../api/orderApi';
import { INewOrder, IOrder } from '../interfaces';
import toast from 'react-hot-toast';
import { mapOrderStatusToString } from '../utils/mapOrderStatusToString';
import CustomSpinner from '../components/CustomSpinner';

export default function AdminPageOrders() {
  const [orders, setOrders] = useState<IAdminOrderRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOrderDialogOpen, setIsCreateOrderDialogOpen] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiOrders: IOrder[] = await getOrders();
      const adminTableRows: IAdminOrderRow[] = apiOrders.map((order) => ({
        id: order.id,
        customerName: order.fullName,
        customerEmail: order.email,
        status: mapOrderStatusToString(order.orderStatus),
        itemCount: order.orderProducts.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: order.orderProducts.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0
        ),
        currency: 'SEK',
      }));
      setOrders(adminTableRows);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again later.');
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewOrder = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };

  // Handle delete order action
  const handleDeleteOrder = (orderId: string) => {
    // TODO: Implement delete order functionality with confirmation
    console.log('Delete order:', orderId);
  };

  // Handles open the create order dialog
  function handleOpenCreateOrderDialog() {
    setIsCreateOrderDialogOpen(true);
  }

  // handles close the create order dialog
  function handleCloseCreateOrderDialog() {
    setIsCreateOrderDialogOpen(false);
  }

  const handleCreateOrderSubmit = async (orderData: INewOrder) => {
    console.log('Creating order with data:', orderData);
    try {
      const newOrder = await createOrder(orderData);
      toast.success(`Order ${newOrder.id} created successfully!`);
      console.log('New order created:', newOrder);
      handleCloseCreateOrderDialog();
      await fetchOrders();
    } catch (error) {
      console.error('Failed to create order:', error);
      toast.error('Failed to create order. Please try again.');
    }
  };

  return (
    <Box>
      <PageBreadcrumbs />
      {loading ? (
        <CustomSpinner text="Loading orders..." />
      ) : error ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <p>{error}</p>
          <Button onClick={fetchOrders} sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={BUTTON_ROW_STYLE}>
            <Button
              color={'inherit'}
              variant={'outlined'}
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin')}
            >
              Back to admin dashboard
            </Button>

            <Button
              variant={'contained'}
              color={'primary'}
              onClick={handleOpenCreateOrderDialog}
              startIcon={<AddCircleOutlineIcon />}
            >
              New Order
            </Button>
          </Box>

          {orders.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <p>No orders found.</p>
            </Box>
          ) : (
            <OrderAdminTable
              orders={orders}
              onView={handleViewOrder}
              onDelete={handleDeleteOrder}
            />
          )}
        </>
      )}
      <OrderCreateDialog
        open={isCreateOrderDialogOpen}
        onClose={handleCloseCreateOrderDialog}
        onSubmit={handleCreateOrderSubmit}
      />
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const BUTTON_ROW_STYLE = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 3,
  mt: 3,
};
