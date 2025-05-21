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
        crumbs.push({ label: 'Store' });
      } else {
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

    // ADMIN
    case 'admin':
      if (parts.length === 1) {
        crumbs.push({ label: 'Admin' });
      } else if (parts[1] === 'products') {
        crumbs.push({ label: 'Admin', to: '/admin' });
        crumbs.push({ label: 'Products' });
      } else if (parts[1] === 'orders') {
        crumbs.push({ label: 'Admin', to: '/admin' });
        crumbs.push({ label: 'Orders' });
      }
      break;
  }

  return crumbs;
}
