import { Typography, SxProps, Theme, Box } from '@mui/material';
import { useCart } from '../hooks/useCart';
import { CartItemList } from '../components/Cart/CartItemList';

export default function CartPage() {
  const { items, increaseQuantity, decreaseQuantity, removeItem } = useCart();
  const CART_TITLE = 'Your Shopping Cart';

  return (
    <Box sx={CART_PAGE_STYLE}>
      <Typography variant={'h4'}>{CART_TITLE}</Typography>
      <CartItemList
        items={items}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onRemove={removeItem}
      />
    </Box>
  );
}

/*━━━━━━━━━━━━ Styling ━━━━━━━━━━━━*/
const CART_PAGE_STYLE: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  mt: 10,
};
