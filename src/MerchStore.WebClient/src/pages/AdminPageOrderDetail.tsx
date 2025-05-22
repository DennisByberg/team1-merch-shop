import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomSpinner from '../components/CustomSpinner';
import PageBreadcrumbs from '../components/PageBreadcrumbs';
import { IAdminOrderDetailItem, IAdminOrderDetailView } from '../interfaces';
import { blue, green, grey, pink, purple } from '@mui/material/colors';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const mockOrderDetail: IAdminOrderDetailView = {
  id: '84e85190-a70d-40a0-8a90-629babfd9acb',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  street: '123 Main St',
  postalCode: '11111',
  city: 'Stockholm',
  country: 'Sweden',
  orderStatus: 3,
  items: [
    {
      orderItemId: 'item-1',
      productId: 'prod-mug',
      productName: 'Developer Mug',
      quantity: 1,
      unitPrice: 149.5,
      lineItemTotalPrice: 149.5,
      currency: 'SEK',
    },
    {
      orderItemId: 'item-2',
      productId: 'prod-tshirt',
      productName: 'Conference T-Shirt',
      quantity: 2,
      unitPrice: 249.99,
      lineItemTotalPrice: 499.98,
      currency: 'SEK',
    },
  ],
  totalOrderAmount: 649.48,
  currency: 'SEK',
};

// Mapping for order status numbers to display strings
const orderStatusMap: { [key: number]: string } = {
  0: 'Pending',
  1: 'Processing',
  2: 'Shipped',
  3: 'Delivered',
  4: 'Cancelled',
};

export default function AdminPageOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IAdminOrderDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<number | string>('');
  // const [isEditingShipping, setIsEditingShipping] = useState(false); // For future edit functionality

  useEffect(() => {
    setLoading(true);
    setError(null); // Reset error on new fetch
    // TODO: Replace with actual API call:
    // fetchOrder(orderId)
    //   .then(data => {
    //     if (data) {
    //       setOrder(data);
    //       setSelectedStatus(data.orderStatus);
    //     } else {
    //       setError('Order data not found.'); // Or handle as a specific case
    //       setOrder(null);
    //     }
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //     setError('Failed to fetch order details. Please try again later.');
    //     setLoading(false);
    //   });

    // Using mock data for now
    setTimeout(() => {
      const foundOrder = { ...mockOrderDetail, id: orderId || mockOrderDetail.id };
      setOrder(foundOrder);
      setSelectedStatus(foundOrder.orderStatus);
      setLoading(false);
    }, 1000);
  }, [orderId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleStatusChange = (event: any) => {
    setSelectedStatus(event.target.value as number);
  };

  const handleUpdateStatus = () => {
    // TODO: Implement API call to update order status
    console.log(`Updating status for order ${order?.id} to ${selectedStatus}`);
    // Potentially update local state if API call is successful
    if (order) {
      setOrder({ ...order, orderStatus: Number(selectedStatus) });
    }
  };

  const handleAddItem = () => {
    // TODO: Implement logic to add a new item to the order
    // This might involve opening a dialog to select a product and quantity
    alert('Add new item to order - TBD');
  };

  const handleRemoveItem = (orderItemId: string) => {
    // TODO: Implement API call to remove item from order
    // And update local state
    if (order) {
      const updatedItems = order.items.filter((item) => item.orderItemId !== orderItemId);
      const updatedTotal = updatedItems.reduce(
        (sum, item) => sum + item.lineItemTotalPrice,
        0
      );
      setOrder({ ...order, items: updatedItems, totalOrderAmount: updatedTotal });
      alert(`Remove item ${orderItemId} - TBD`);
    }
  };

  return (
    <Box sx={PAGE_CONTAINER_STYLE}>
      <PageBreadcrumbs />
      <Box sx={BUTTON_ROW_STYLE}>
        <Button
          color={'inherit'}
          variant={'outlined'}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/orders')}
        >
          Back to Orders List
        </Button>
      </Box>

      {/* Conditional content area */}
      {loading ? (
        <CustomSpinner text={'Loading order details...'} />
      ) : error || !order ? ( // Combined check for error or if order is not found
        <Box sx={CENTERED_CONTAINER_SX}>
          <Typography color={error ? 'error' : 'inherit'} gutterBottom>
            {error ? error : 'Order not found.'}
          </Typography>
          {/* The "Back to Orders List" button is now always visible above, so it's removed from here */}
        </Box>
      ) : (
        <>
          {/* Container for the top row of cards */}
          <Box sx={TOP_CARDS_CONTAINER_SX}>
            {/* Order Information Card */}
            <Paper sx={FLEX_CARD_STYLE}>
              <Typography
                sx={{ color: purple[200], pb: 2 }}
                fontWeight={'bold'}
                variant={'h6'}
                gutterBottom
              >
                Order Information
              </Typography>
              <Typography variant={'body1'}>Order ID: {order.id}</Typography>
              <Typography variant={'body1'} sx={{ mt: 1 }}>
                Total: {order.totalOrderAmount.toFixed(2)} {order.currency}
              </Typography>
              <Box sx={STATUS_UPDATE_SECTION_SX}>
                <Typography variant={'body1'} component={'div'}>
                  Status:{' '}
                  <Box component={'span'}>
                    {orderStatusMap[order.orderStatus] || 'Unknown'}
                  </Box>
                </Typography>
                <Select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  size={'small'}
                  sx={{ minWidth: 150, mr: 1 }}
                >
                  {Object.entries(orderStatusMap).map(([key, value]) => (
                    <MenuItem key={key} value={parseInt(key)}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  variant={'contained'}
                  size={'small'}
                  onClick={handleUpdateStatus}
                  disabled={Number(selectedStatus) === order.orderStatus}
                >
                  Update
                </Button>
              </Box>
            </Paper>

            {/* Customer Information Card */}
            <Paper sx={FLEX_CARD_STYLE}>
              <Box sx={CARD_HEADER_WITH_ACTION_SX}>
                <Typography
                  sx={{ color: pink[200] }}
                  fontWeight={'bold'}
                  variant={'h6'}
                  gutterBottom
                >
                  Customer Information
                </Typography>
                <Button
                  size={'small'}
                  startIcon={<EditIcon />}
                  onClick={() => alert('Edit customer information - TBD')} // Placeholder for edit functionality
                >
                  Edit
                </Button>
              </Box>
              <Typography variant={'body1'}>Name: {order.fullName}</Typography>
              <Typography variant={'body1'} sx={{ mt: 1 }}>
                Email: {order.email}
              </Typography>
            </Paper>

            {/* Shipping Address Card */}
            <Paper sx={FLEX_CARD_STYLE}>
              <Box sx={CARD_HEADER_WITH_ACTION_SX}>
                <Typography
                  variant={'h6'}
                  sx={{ color: green[200] }}
                  fontWeight={'bold'}
                  gutterBottom
                >
                  Shipping Address
                </Typography>
                <Button
                  size={'small'}
                  startIcon={<EditIcon />}
                  onClick={() => alert('Edit shipping address - TBD')}
                >
                  Edit
                </Button>
              </Box>
              <Typography variant={'body1'}>{order.street}</Typography>
              <Typography variant={'body1'}>
                {order.postalCode} {order.city}
              </Typography>
              <Typography variant={'body1'}>{order.country}</Typography>
            </Paper>
          </Box>

          {/* Order Items Card - Full width */}
          <Paper sx={FULL_WIDTH_CARD_STYLE}>
            <Box sx={CARD_HEADER_WITH_ACTION_SX}>
              <Typography
                sx={{ color: blue[200] }}
                variant={'h6'}
                fontWeight={'bold'}
                gutterBottom
              >
                Order Items
              </Typography>
              <Button
                variant={'contained'}
                color={'primary'}
                size={'small'}
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            </Box>
            <TableContainer>
              <Table size={'small'}>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align={'right'}>Price</TableCell>
                    <TableCell align={'center'}>Quantity</TableCell>
                    <TableCell align={'right'}>Subtotal</TableCell>
                    <TableCell align={'center'}>Actions</TableCell>{' '}
                    {/* New Actions column */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item: IAdminOrderDetailItem) => (
                    <TableRow key={item.orderItemId}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell align={'right'}>
                        {item.unitPrice.toFixed(2)} {item.currency}
                      </TableCell>
                      <TableCell align={'center'}>{item.quantity}</TableCell>
                      <TableCell align="right">
                        {item.lineItemTotalPrice.toFixed(2)} {item.currency}
                      </TableCell>
                      <TableCell align={'center'}>
                        <IconButton
                          size={'small'}
                          color={'error'}
                          onClick={() => handleRemoveItem(item.orderItemId)}
                          title={'Remove item'}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ backgroundColor: grey[900] }}>
                    <TableCell colSpan={3} />
                    <TableCell
                      sx={{ pt: 2, pb: 2, fontWeight: 'bold', fontSize: 18 }}
                      align={'right'}
                    >
                      Total:
                    </TableCell>
                    <TableCell
                      sx={{ pt: 2, pb: 2, fontWeight: 'bold', fontSize: 18 }}
                      align={'right'}
                    >
                      {order.totalOrderAmount.toFixed(2)} {order.currency}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const PAGE_CONTAINER_STYLE: SxProps = {
  py: 2,
  px: { xs: 2, md: 3 },
};

const BUTTON_ROW_STYLE = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 3,
  mt: 3,
};

const TOP_CARDS_CONTAINER_SX: SxProps = {
  display: 'flex',
  flexDirection: { xs: 'column', lg: 'row' },
  gap: 2.5,
  mb: 3,
};

const FLEX_CARD_STYLE: SxProps<Theme> = (theme) => ({
  p: theme.spacing(2.5),
  flex: { lg: 1 },
  display: 'flex',
  flexDirection: 'column',
});

const FULL_WIDTH_CARD_STYLE: SxProps<Theme> = (theme) => ({
  p: theme.spacing(2.5),
  width: '100%',
});

const CENTERED_CONTAINER_SX: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '60vh',
  textAlign: 'center',
};

const STATUS_UPDATE_SECTION_SX: SxProps = {
  mt: 2,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  flexWrap: 'wrap',
};

const CARD_HEADER_WITH_ACTION_SX: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2,
};
