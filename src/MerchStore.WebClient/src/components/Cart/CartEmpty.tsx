import { Box, Typography, SxProps, Theme, Avatar } from '@mui/material';
import { grey } from '@mui/material/colors';

export function CartEmpty() {
  const CART_EMPTY_TITLE = 'Your cart is empty';
  const CART_EMPTY_SUBTITLE = 'Add some products to your cart to see them here';

  return (
    <Box sx={CART_EMPTY_STYLE}>
      <Typography variant={'h5'}>{CART_EMPTY_TITLE}</Typography>
      <Typography variant={'body1'} color={'text.secondary'}>
        {CART_EMPTY_SUBTITLE}
      </Typography>
      <Avatar
        src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
        alt={'Empty cart'}
        sx={CART_EMPTY_AVATAR_STYLE}
        variant={'rounded'}
      />
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const CART_EMPTY_STYLE: SxProps<Theme> = {
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
  textAlign: 'center',
  color: grey[700],
  pb: 2,
  pt: 5,
  gap: 3,
};

const CART_EMPTY_AVATAR_STYLE: SxProps<Theme> = {
  width: 80,
  height: 80,
  opacity: 0.6,
};
