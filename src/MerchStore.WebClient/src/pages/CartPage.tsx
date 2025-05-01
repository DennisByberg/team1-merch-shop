import { Container, Typography } from '@mui/material';
import { useCart } from '../hooks/useCart';
import { CartItemList } from '../components/Cart/CartItemList';

function CartPage() {
  const { items, increaseQuantity, decreaseQuantity, removeItem } = useCart();
  console.log(items);

  return (
    <Container
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', mt: 10 }}
    >
      <Typography variant={'h4'}>Your Shopping Cart</Typography>
      <CartItemList
        items={items}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onRemove={removeItem}
      />
    </Container>
  );
}

export default CartPage;
