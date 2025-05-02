import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export function useCart() {
  // Get the cart context value
  const cartContext = useContext(CartContext);

  // If the hook is used outside of a CartProvider, throw an error
  if (!cartContext) throw new Error('useCart must be used within CartProvider');

  // Return the cart context value (cart data and functions)
  return cartContext;
}
