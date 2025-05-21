import { Box, Typography, Button, Paper, SxProps } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumbs from '../components/PageBreadcrumbs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AdminPageOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  // const [order, setOrder] = useState<IAdminOrderDetail | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   if (orderId) {
  //     const loadOrderDetails = async () => {
  //       try {
  //         setLoading(true);
  //         // const data = await fetchOrderById(orderId); // API call
  //         // setOrder(data);
  //         // setError(null);
  //       } catch (err) {
  //         // setError('Failed to fetch order details.');
  //         // console.error(err);
  //       } finally {
  //         // setLoading(false);
  //       }
  //     };
  //     loadOrderDetails();
  //   }
  // }, [orderId]);

  // if (loading) {
  //   return <CircularProgress />;
  // }

  // if (error) {
  //   return <Typography color="error">{error}</Typography>;
  // }

  // if (!order) {
  //   return <Typography>Order not found.</Typography>;
  // }

  return (
    <Box sx={PAGE_CONTAINER_STYLE}>
      <PageBreadcrumbs />
      <Box sx={HEADER_STYLE}>
        <Typography variant="h4" component="h1" gutterBottom>
          Order Details: {orderId} {/* Placeholder for actual order ID from data */}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/orders')}
          sx={{ mb: { xs: 2, md: 0 } }}
        >
          Back to Orders
        </Button>
      </Box>

      {/* Order details will be rendered here */}
      <Paper elevation={3} sx={PAPER_STYLE}>
        <Typography variant="h6">Order ID: {orderId}</Typography>
        {/* More details to come */}
      </Paper>
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const PAGE_CONTAINER_STYLE: SxProps = {
  py: 2,
};

const HEADER_STYLE: SxProps = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  justifyContent: 'space-between',
  alignItems: { xs: 'flex-start', md: 'center' },
  mb: 3,
};

const PAPER_STYLE: SxProps = {
  p: 3,
  mt: 2,
};
