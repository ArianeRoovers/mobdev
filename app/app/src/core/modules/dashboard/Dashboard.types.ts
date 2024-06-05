import { Product } from "../product/Product.types";
import { Message } from "../message/Message.types";

export type DashboardData = {
  products: Product[];
  messages: Message[];
};

export type ProductBody = Omit<Product, "_id" | "ownerId">;

export type MessageBody = {
  content: string;
  recipientId: string;
  ownerId?: string;
};
