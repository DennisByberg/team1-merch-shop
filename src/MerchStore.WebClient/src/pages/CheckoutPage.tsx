import {
  Box,
  Button,
  Divider,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { useCart } from '../hooks/useCart';
import { useState } from 'react';
import PageBreadcrumbs from '../components/PageBreadcrumbs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link as RouterLink } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import { INewOrder, INewOrderItem } from '../interfaces';
import { createOrder } from '../api/orderApi';

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitError(null);

    // Prepare order items for the new order payload
    const orderItemsToCreate: INewOrderItem[] = items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      productName: item.name,
      unitPrice: item.price,
    }));

    // Prepare the new order payload
    const newOrderData: INewOrder = {
      fullName: form.fullName,
      email: form.email,
      street: form.street,
      city: form.city,
      postalCode: form.postalCode,
      country: form.country,
      orderProducts: orderItemsToCreate,
    };

    try {
      // Call the API to create the order
      const createdOrder = await createOrder(newOrderData);

      // Clear the cart after the order has been successfully placed
      clearCart();

      // Navigate to confirmation page and pass the actual created order data
      navigate('/order-confirmation', {
        state: { order: createdOrder },
      });
    } catch (error) {
      // Handle errors from the API call
      console.error('Failed to submit order:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Order could not be placed. Please try again.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <PageBreadcrumbs />
      <Box sx={CHECKOUT_CONTENT_STYLE}>
        {/* Left: Customer & Shipping */}
        <Paper variant={'outlined'} sx={CHECKOUT_PAPER_SHARED_STYLE}>
          <form onSubmit={handleSubmit} autoComplete={'off'}>
            <Typography variant={'h6'} fontWeight={600} mb={2}>
              {'Customer Information'}
            </Typography>
            <TextField
              fullWidth
              label={'Full Name'}
              name={'fullName'}
              margin={'normal'}
              value={form.fullName}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
            <TextField
              fullWidth
              label={'Email Address'}
              name={'email'}
              margin={'normal'}
              value={form.email}
              onChange={handleChange}
              required
              type={'email'}
              disabled={isSubmitting}
            />

            <Typography variant={'h6'} fontWeight={600} mt={4} mb={2}>
              {'Shipping Address'}
            </Typography>
            <TextField
              fullWidth
              label={'Street Address'}
              name={'street'}
              margin={'normal'}
              value={form.street}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
            <TextField
              fullWidth
              label={'City'}
              name={'city'}
              margin={'normal'}
              value={form.city}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label={'Postal Code'}
                name={'postalCode'}
                margin={'normal'}
                value={form.postalCode}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              <TextField
                fullWidth
                label={'Country'}
                name={'country'}
                margin={'normal'}
                value={form.country}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </Box>

            {submitError && (
              <Typography color="error" sx={{ mt: 2 }}>
                {submitError}
              </Typography>
            )}

            <Box display={'flex'} justifyContent={'flex-end'} gap={2} mt={4}>
              <Button
                variant={'outlined'}
                color={'inherit'}
                component={RouterLink}
                to={'/cart'}
                startIcon={<ArrowBackIcon />}
                disabled={isSubmitting}
              >
                Back to Cart
              </Button>
              <Button
                variant={'contained'}
                color={'success'}
                type={'submit'}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <CheckCircleIcon />
                  )
                }
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </Button>
            </Box>
          </form>
        </Paper>
        {/* Right: Order Summary */}
        <Paper variant={'outlined'} sx={CHECKOUT_ORDER_SUMMARY_STYLE}>
          <Typography variant={'h6'} fontWeight={600} mb={2}>
            Order Summary
          </Typography>
          {items.length === 0 ? (
            <Typography>Your cart is empty.</Typography>
          ) : (
            <List dense>
              {items.map((item) => (
                <ListItem key={item.id} disableGutters>
                  <ListItemText primary={item.name} secondary={`x ${item.quantity}`} />
                  <Typography>
                    {(item.price * item.quantity).toFixed(2)} {item.currency}
                  </Typography>
                </ListItem>
              ))}
            </List>
          )}
          {items.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent={'space-between'}>
                <Typography fontWeight={600}>Total:</Typography>
                <Typography fontWeight={700}>
                  {total.toFixed(2)} {items[0]?.currency || 'SEK'}
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const CHECKOUT_CONTENT_STYLE = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: 4,
  alignItems: { xs: 'center', md: 'flex-start' },
  justifyContent: { xs: 'center', md: 'flex-start' },
  py: 3,
};

const CHECKOUT_PAPER_SHARED_STYLE = {
  width: { xs: '100%', sm: 400, md: 420 },
  maxWidth: 500,
  minWidth: { xs: 280, md: 350 },
  p: { xs: 2, sm: 3 },
  bgcolor: grey[900],
  flex: { md: 1 },
  display: 'flex',
  flexDirection: 'column',
  border: 'none',
};

const CHECKOUT_ORDER_SUMMARY_STYLE = {
  ...CHECKOUT_PAPER_SHARED_STYLE,
  flex: { md: '0 1 380px' },
  border: `1px dashed ${grey[600]}`,
  alignSelf: { md: 'flex-start' },
};
