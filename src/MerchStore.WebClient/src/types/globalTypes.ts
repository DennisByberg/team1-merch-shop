export type Product = {
  id: string; // (PK, uniqueidentifier, not null)

  name: string; // (nvarchar, not null)
  description: string; // (nvarchar, not null)
  price: number; // (decimal, not null)
  currency: string; // (nvarchar, not null)
  stockQuantity: number; // (int, not null)
  imageUrl?: string; // (nvarchar, null)
};

export type Order = {
  id: string; // (PK, uniqueidentifier, not null)
  fullName: string; // (nvarchar, not null)
  email: string;
  street: string; // (nvarchar, not null)
  city: string;
  postalCode: string;
  country: string;
  orderStatus: string; // (nvarchar, not null)
};

export type OrderItem = {
  id: string; // (PK, uniqueidentifier, not null)
  orderId: string; // (uniqueidentifier, not null)
  productId: string; // (uniqueidentifier, not null)
  quantity: number; // (int, not null)
  price: number; // (decimal, not null)
  currency: string; // (nvarchar, not null)
};

export type Review = {
  id: string;
  productId: string;
  customerName: string;
  title: string;
  content: string;
  rating: number;
  createdAt: string;
  status: string;
};
