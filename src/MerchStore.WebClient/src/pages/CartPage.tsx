import { Box } from '@mui/material';
import { useCart } from '../hooks/useCart';
import { CartItemList } from '../components/Cart/CartItemList';

import { CartActions } from '../components/Cart/CartActions';
import PageBreadcrumbs from '../components/PageBreadcrumbs';
export default function CartPage() {
  const { items, increaseQuantity, decreaseQuantity, removeItem } = useCart();

  return (
    <Box>
      <PageBreadcrumbs />
      <CartItemList
        items={items}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onRemove={removeItem}
      />
      <CartActions items={items} removeItem={removeItem} />
    </Box>
  );
}
