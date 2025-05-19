export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stockQuantity: number;
  imageUrl?: string;
};

export type Order = {
  id: string;
  fullName: string;
  email: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  orderStatus: string;
};

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
