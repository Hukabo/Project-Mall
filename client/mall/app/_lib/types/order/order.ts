import {
  OrderStatus,
  OrderStatusKeys,
} from "@/app/(order_history)/orders/page";

export interface Order {
  id: string;
  name: string;
  status: OrderStatusKeys;
  orderItems: OrderItem[];
  timeStamp: TimeStamp;
}
