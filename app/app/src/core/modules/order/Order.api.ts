import { API } from "@core/network/api";
import { Order, OrderCreationPayload } from "./Order.types";

export const getOrderDetails = (orderId: string) => {
  return API.get<Order>(`/order/${orderId}`);
};

export const createOrder = (orderData: OrderCreationPayload) => {
  return API.post<Order>("/order", orderData);
};

export const getOrdersByUser = (userId: string) => {
  return API.get<Order[]>(`/orders/user/${userId}`);
};

export const getOrdersBySeller = () => {
  return API.get<Order[]>(`/orders/seller`);
};
