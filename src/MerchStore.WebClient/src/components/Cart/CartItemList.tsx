import { CartEmpty } from './CartEmpty';
import { CartItem } from '../../context/CartProvider';
import { CartTable } from './CartTable';

type CartItemListProps = {
  items: CartItem[];
  onRemove?: (id: string) => void;
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
};

export function CartItemList(props: CartItemListProps) {
  if (!props.items.length) return <CartEmpty />;
  return <CartTable {...props} />;
}
