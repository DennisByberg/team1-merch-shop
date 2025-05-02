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
} from '@mui/material';
import { useCart } from '../hooks/useCart';
import { useState } from 'react';
import PageBreadcrumbs from '../components/PageBreadcrumbs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link as RouterLink } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const { items } = useCart();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate('/order-confirmation');
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
            />
            <TextField
              fullWidth
              label={'City'}
              name={'city'}
              margin={'normal'}
              value={form.city}
              onChange={handleChange}
              required
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
              />
              <TextField
                fullWidth
                label={'Country'}
                name={'country'}
                margin={'normal'}
                value={form.country}
                onChange={handleChange}
                required
              />
            </Box>
            <Box display={'flex'} justifyContent={'flex-end'} gap={2} mt={4}>
              <Button
                variant={'outlined'}
                color={'inherit'}
                component={RouterLink}
                to={'/cart'}
                startIcon={<ArrowBackIcon />}
              >
                Back to Cart
              </Button>
              <Button
                variant={'contained'}
                color={'success'}
                type={'submit'}
                startIcon={<CheckCircleIcon />}
              >
                Place Order
              </Button>
            </Box>
          </form>
        </Paper>
        {/* Right: Order Summary */}
        <Paper variant={'outlined'} sx={CHECKOUT_ORDER_SUMMARY_STYLE}>
          <Typography variant={'h6'} fontWeight={600} mb={2}>
            Order Summary
          </Typography>
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
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent={'space-between'}>
            <Typography fontWeight={600}>Total:</Typography>
            <Typography fontWeight={700}>
              {total.toFixed(2)} {items[0]?.currency}
            </Typography>
          </Box>
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
};

const CHECKOUT_PAPER_SHARED_STYLE = {
  width: { xs: '100%', sm: 400, md: 420 },
  maxWidth: 500,
  minWidth: { xs: 280, md: 350 },
  p: 3,
  bgcolor: grey[900],
  mb: { xs: 2, md: 0 },
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  border: 'none',
};

const CHECKOUT_ORDER_SUMMARY_STYLE = {
  ...CHECKOUT_PAPER_SHARED_STYLE,
  border: `1px dashed ${grey[600]}`,
};
