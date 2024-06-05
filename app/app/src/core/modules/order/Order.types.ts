export type OrderItem = {
  productId: {
    _id: string;
    name: string;
  };
  quantity: number;
  price: number;
};

export type Order = {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  createdAt: Date;
  updatedAt?: Date;
};

export type OrderCreationPayload = {
  userId: string;
  items: { productId: string; quantity: number }[];
};
