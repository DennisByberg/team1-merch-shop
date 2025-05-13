import { Box, Typography, Button, Stack } from '@mui/material';
import PageBreadcrumbs from '../components/PageBreadcrumbs';
import { Link as RouterLink } from 'react-router-dom';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { grey } from '@mui/material/colors';

export default function AdminPage() {
  return (
    <Box sx={{ mt: 2, mb: 4, textAlign: 'center' }}>
      <PageBreadcrumbs />

      {/* Page Title */}
      <Typography variant={'h4'} gutterBottom fontWeight={'bold'} sx={{ mt: 3 }}>
        Welcome to the Admin Dashboard
      </Typography>

      {/* Description */}
      <Typography variant={'subtitle1'} color={grey[500]} gutterBottom sx={{ mb: 5 }}>
        Manage your products, orders, and more from this administrative area.
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 3 }}
        alignItems={'center'}
        justifyContent={'center'}
      >
        {/*Manage products button*/}
        <Button
          variant={'contained'}
          color={'primary'}
          component={RouterLink}
          to={''} // TODO: Add the correct route for managing products
          size={'large'}
          startIcon={<InventoryIcon />}
          sx={{ width: { xs: '80%', sm: 'auto' } }}
        >
          Manage Products
        </Button>

        {/*Manage orders button*/}
        <Button
          variant={'contained'}
          color={'secondary'}
          component={RouterLink}
          to={''} // TODO: Add the correct route for managing orders
          size={'large'}
          startIcon={<ReceiptLongIcon />}
          sx={{ width: { xs: '80%', sm: 'auto' } }}
        >
          Manage Orders
        </Button>
      </Stack>
    </Box>
  );
}
