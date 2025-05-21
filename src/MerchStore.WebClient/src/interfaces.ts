// A single product item in the product list [  /api/products/{id}  ]
export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  stockQuantity: number;
  inStock: boolean;
}

export interface IOrder {
  id: string;
  fullName: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  orderStatus: string;
}

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  currency: string;
};

export type Review = {
  id: string;
  productId: string;
  content: string;
  createdAt: string;
  customerName: string;
  rating: number;
  status: string;
  title: string;
};

export type ReviewStats = {
  productId: string;
  averageRating: number;
  reviewCount: number;
};

export interface INewOrderItem {
  productId: string;
  quantity: number;
  price: number;
  currency: string;
}

export interface INewOrder {
  fullName: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  items: INewOrderItem[];
  // orderStatus is set by the backend upon creation
}

// --- TYPES FOR THE ADMIN ORDER DETAIL VIEW (/admin/orders/:orderId) ---
// Represents the detailed view of an order for an admin.
export interface IAdminOrderDetailView {
  id: string;

  fullName: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  orderStatus: number; // Should be string for easier implementations?
  items: IAdminOrderDetailItem[];

  // TODO: NEED THIS FROM API!!!
  totalOrderAmount: number; // (sum of all lineItemTotalPrice)
  currency: string; // Currency for totalOrderAmount.
}

// Represents a single item within the detailed order view for an admin.
export interface IAdminOrderDetailItem {
  orderItemId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;

  // TODO: NEED THIS FROM API!!!
  lineItemTotalPrice: number; // (quantity * unitPrice)
  currency: string; // Currency for unitPrice and lineItemTotalPrice.
}
