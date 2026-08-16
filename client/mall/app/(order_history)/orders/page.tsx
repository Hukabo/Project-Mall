// app/(main)/orders/page.tsx
"use client";

import { api } from "@/app/_lib/api/api";
import { Order } from "@/app/_lib/types/order/order";
import {
  OrderStatus,
  OrderStatusKeys,
  STATUS_STYLE,
} from "@/app/_lib/types/order/order_status";
import { transferDate, won } from "@/app/_lib/util/common";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

function StatusBadge({ status }: { status: OrderStatusKeys }) {
  return (
    <span
      className={`inline-block px-3 py-1 text-xs border rounded-full ${STATUS_STYLE[status]}`}
    >
      {OrderStatus[status]}
    </span>
  );
}

function OrderCard({ order }: { order: Order }) {
  const totalAmount = order.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const date = transferDate(order.timeStamp.createdAt);

  return (
    <Link
      href={`/orders/${order.id}`}
      className="block bg-surface border border-line"
    >
      {/* 상단 - 영수증 헤더 느낌 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-dashed border-line text-gray-500">
        <div className="flex items-center gap-3">
          <span className="text-sm">{date}</span>
          <span className="text-sm">주문번호: {order.id.split("-", 1)[0]}</span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* 상품 목록 */}
      <div className="px-6 py-4 space-y-3">
        {order.orderItems.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <img
              src={item.thumbnail}
              alt={`${item.name} ${item.color} preview image`}
              className="w-14 h-14 object-cover bg-paper"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{item.name}</p>
              <p className="text-xs text-grey-light-4">
                {item.color} {item.size} · {item.quantity}개
              </p>
            </div>
          </div>
        ))}
        {order.orderItems.length > 3 && (
          <p className="text-xs text-grey-light-4">
            외 {order.orderItems.length - 3}개 상품
          </p>
        )}
      </div>

      {/* 하단 - 합계 */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-line">
        <span className="text-sm">총 결제금액</span>
        <span className="text-lg font-medium">{won(totalAmount)}</span>
      </div>
    </Link>
  );
}

function EmptyOrders() {
  return (
    <div className="bg-surface w-full border border-line text-center py-20 absolute top-1/2 left-1/2 -translate-1/2">
      <p className="text-xl font-light">아직 주문 내역이 없어요</p>
      <p className="text-grey-light-4 mt-2 text-sm">
        마음에 드는 상품을 찾아보세요
      </p>
      <Link
        href="/"
        className="inline-block mt-6 px-6 py-2 border border-line hover:border-moss transition-colors text-sm"
      >
        쇼핑 계속하기
      </Link>
    </div>
  );
}

export default function OrdersPage() {
  const { data: orders, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get<Order[]>("orders"),
  });

  return (
    <div className="min-h-screen px-6 py-16 max-w-3xl mx-auto relative">
      <h1 className="text-3xl font-light mb-10">주문내역</h1>

      {isError && (
        <div className="bg-surface border border-line text-center py-20">
          <p className="text-grey-light-4">
            주문 내역을 불러오는 중 문제가 발생했어요
          </p>
        </div>
      )}

      {orders && orders.length === 0 && <EmptyOrders />}

      {orders && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
