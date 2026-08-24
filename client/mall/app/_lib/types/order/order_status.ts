export type OrderStatusKeys =
  | "PREPARING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export enum OrderStatus {
  PREPARING = "상품 준비중",
  SHIPPING = "배송중",
  DELIVERED = "배송 완료",
  CANCELLED = "주문 취소",
}

export const STATUS_STYLE: Record<OrderStatusKeys, string> = {
  PREPARING: "text-mustard border-mustard",
  SHIPPING: "text-mustard border-mustard",
  DELIVERED: "text-moss border-moss",
  CANCELLED: "text-red-400 border-red-300",
};
