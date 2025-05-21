import { Box, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PageBreadcrumbs from '../components/PageBreadcrumbs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OrderAdminTable, { IAdminOrderRow } from '../components/Admin/OrderAdminTable';
import CustomSpinner from '../components/CustomSpinner';

// Mock data for now - replace with actual data fetching later
// Ensure mockOrders matches IAdminOrderRow structure if you haven't defined a global type yet
const mockOrders: IAdminOrderRow[] = [
  {
    id: '5377bf13-a59f-46e7-a0a5-8c61fd881215',
    customerName: 'Kalle Anka',
    customerEmail: 'kalle@anka.com',
    status: 'Received',
    itemCount: 2,
    totalPrice: 299,
    currency: 'SEK',
  },
  {
    id: '5377bf13-a59f-46e7-a0a5-8c61fd881216',
    customerName: 'Musse Pigg',
    customerEmail: 'musse@pigg.com',
    status: 'Processing',
    itemCount: 1,
    totalPrice: 199,
    currency: 'SEK',
  },
  {
    id: '5377bf13-a59f-46e7-a0a5-8c61fd881217',
    customerName: 'Janne Långben',
    customerEmail: 'janne@langben.com',
    status: 'Shipped',
    itemCount: 5,
    totalPrice: 799,
    currency: 'SEK',
  },
];

export default function AdminPageOrders() {
  // TODO: Replace with useOrders hook and actual state management & replace loading state with actual loading state
  const orders = mockOrders;
  const isLoading = false;

  const navigate = useNavigate();

  const handleViewOrder = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    // TODO: Implement delete order functionality with confirmation
    // This would typically involve opening a confirmation dialog
    console.log('Delete order:', orderId);
    // Example: setOrderToDelete(orderId); setDeleteDialogOpen(true);
  };

  return (
    <Box>
      <PageBreadcrumbs />
      {isLoading ? (
        <CustomSpinner text="Loading orders..." />
      ) : (
        <>
          {/* Container for Back and Add New Order buttons */}
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
              component={RouterLink}
              to={''}
              startIcon={<AddCircleOutlineIcon />}
            >
              New Order
            </Button>
          </Box>

          {/* Order Admin Table */}
          <OrderAdminTable
            orders={orders}
            onView={handleViewOrder}
            onDelete={handleDeleteOrder}
          />
        </>
      )}
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
