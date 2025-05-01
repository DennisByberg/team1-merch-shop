import { CartEmpty } from './CartEmpty';
import { CartItem } from '../../context/CartProvider';
import { CartTable } from './CartTable';

interface ICartItemListProps {
  items: CartItem[];
  onRemove?: (id: string) => void;
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
}

export function CartItemList(props: ICartItemListProps) {
  if (!props.items.length) return <CartEmpty />;
  return <CartTable {...props} />;
}
