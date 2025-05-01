import { Box, Typography } from '@mui/material';

export function CartEmpty() {
  return (
    <Box
      sx={{
        mt: 6,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        border: '1px dashed #888',
        borderRadius: 2,
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Your cart is empty
      </Typography>
      <Typography variant={'body1'} color={'text.secondary'}>
        Add some products to your cart to see them here
      </Typography>
      <Box sx={{ mt: 3 }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          alt="Empty cart"
          width={80}
          height={80}
          style={{ opacity: 0.5 }}
        />
      </Box>
    </Box>
  );
}
