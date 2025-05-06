export type Crumb = { label: string; to?: string };

/**
 * Creates an array of breadcrumbs based on the path and optional product name.
 * - The last crumb lacks "to" and is therefore not a link.
 * - Example: /store/123 => Home / Store / Product Name
 */
export function getCrumbs(pathname: string, productName?: string): Crumb[] {
  // Split the path into parts, e.g. "/store/123" => ["store", "123"]
  const parts = pathname.split('/').filter(Boolean);

  // Always start with Home link
  const crumbs: Crumb[] = [{ label: 'Home', to: '/' }];

  // Handle different pages
  switch (parts[0]) {
    case 'store':
      if (parts.length === 1) {
        // On /store, show only "Store" without link
        crumbs.push({ label: 'Store' });
      } else {
        // On e.g. /store/123, "Store" is a link, product name is the last crumb
        crumbs.push({ label: 'Store', to: '/store' });
        crumbs.push({ label: productName || 'Product Details' });
      }
      break;

    // CART
    case 'cart':
      crumbs.push({ label: 'Cart' });
      break;

    // ORDER CONFIRMATION
    case 'order-confirmation':
      crumbs.push({ label: 'Order-Confirmation' });
      break;

    // CHECKOUT
    case 'checkout':
      crumbs.push({ label: 'Checkout' });
      break;
  }

  return crumbs;
}
