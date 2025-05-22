import { useState, useEffect, ReactNode } from 'react';
import { IProduct } from '../interfaces';
import { CartContext } from './CartContext';

export type CartItem = IProduct & { quantity: number };

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  // Load cart items from localStorage when the component mounts
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Add a product to the cart
  function addToCart(product: IProduct) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  // Increase the quantity of a product in the cart
  function increaseQuantity(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  // Decrease the quantity of a product in the cart
  function decreaseQuantity(id: string) {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  // Remove a product from the cart
  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  // Clear the cart
  function clearCart() {
    setItems([]);
  }

  // Get the total product count in the cart
  function getTotalProductCount() {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        getTotalProductCount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
