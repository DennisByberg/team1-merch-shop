import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
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
import { IAdminOrderDetailItem } from '../interfaces';
import { blue, green, grey, pink, purple } from '@mui/material/colors';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { mapOrderStatusToString } from '../utils/mapOrderStatusToString';
import { useFetchOrderDetails } from '../hooks/useFetchOrderDetails';
import toast from 'react-hot-toast';
import { OrderStatusEnum } from '../enums/OrderStatusEnum';

export default function AdminPageOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // Custom hook to fetch order details
  const { order, loading, error } = useFetchOrderDetails(orderId);

  // Extract enum values as numbers
  const availableOrderStatuses = Object.values(OrderStatusEnum).filter(
    (value) => typeof value === 'number'
  ) as number[];

  // State for the selected status in the dropdown
  const [selectedStatus, setSelectedStatus] = useState<number | ''>('');

  // Effect to update selectedStatus when the order data is loaded or changed by the hook
  useEffect(() => {
    if (order) {
      setSelectedStatus(order.orderStatus);
    } else {
      setSelectedStatus('');
    }
  }, [order]);

  const handleStatusChange = (event: SelectChangeEvent<number>) => {
    setSelectedStatus(Number(event.target.value));
  };

  // TODO: Implement API call to update order status
  const handleUpdateStatus = () => {
    if (!order) return;
    console.log(`Updating status for order ${order.id} to ${selectedStatus}`);
    toast('Status update API call - TBD');
  };

  // TODO: Implement logic to add a new item to the order
  const handleAddItem = () => {
    alert('Add new item to order - TBD');
  };

  // TODO: Implement API call to remove item from order
  const handleRemoveItem = (orderItemId: string) => {
    if (!order) return;
    toast(`Remove item ${orderItemId} - TBD (API call needed)`);
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
      ) : error || !order ? (
        <Box sx={CENTERED_CONTAINER_SX}>
          <Typography color={error ? 'error' : 'inherit'} gutterBottom>
            {error ? error : 'Order not found.'}
          </Typography>
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
                    {mapOrderStatusToString(order.orderStatus)}
                  </Box>
                </Typography>
                <Select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  size={'small'}
                  sx={{ minWidth: 150, mr: 1 }}
                >
                  {availableOrderStatuses.map((statusNumber) => (
                    <MenuItem key={statusNumber} value={statusNumber}>
                      {mapOrderStatusToString(statusNumber)}
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
                  onClick={() => alert('Edit customer information - TBD')}
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
