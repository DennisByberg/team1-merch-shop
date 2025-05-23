import { OrderStatusEnum } from './enums/OrderStatusEnum';

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
  orderStatus: OrderStatusEnum;
  orderProducts: INewOrderItem[];
}

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  currency: 'SEK';
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

// Lägg till interface för det externa API:ets svar
export interface ExternalReviewResponse {
  reviewerName: string;
  text: string;
  rating: number;
  reviewDate: string;
  reviewId: number;
}

export interface INewOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface INewOrder {
  fullName: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  orderProducts: INewOrderItem[];
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
  orderStatus: OrderStatusEnum;
  items: IAdminOrderDetailItem[];

  totalOrderAmount: number;
  currency: 'SEK';
}

// Represents a single item within the detailed order view for an admin.
export interface IAdminOrderDetailItem {
  orderItemId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;

  lineItemTotalPrice: number;
  currency: 'SEK';
}
