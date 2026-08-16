export type OrderStatusKeys =
  | "PENDING"
  | "PAID"
  | "PREPARING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export enum OrderStatus {
  PENDING = "결제 대기",
  PAID = "결제 완료",
  PREPARING = "상품 준비중",
  SHIPPING = "배송중",
  DELIVERED = "배송 완료",
  CANCELLED = "주문 취소",
}

export const STATUS_STYLE: Record<OrderStatusKeys, string> = {
  PENDING: "text-grey-light-4 border-line",
  PAID: "text-moss border-moss",
  PREPARING: "text-mustard border-mustard",
  SHIPPING: "text-mustard border-mustard",
  DELIVERED: "text-moss border-moss",
  CANCELLED: "text-red-400 border-red-300",
};
