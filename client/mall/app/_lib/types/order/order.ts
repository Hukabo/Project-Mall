import {} from "@/app/(order_history)/orders/page";
import { OrderStatusKeys } from "./order_status";

export interface Order {
  id: string;
  name: string;
  status: OrderStatusKeys;
  orderItems: OrderItem[];
  timeStamp: TimeStamp;
}
