"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { api } from "../_lib/api/api";

import { useParams, useRouter } from "next/navigation";
import { won } from "@/app/_lib/util/common";
import Link from "next/link";
import { UserContext } from "../_lib/provider/UserProvider";
import Image from "next/image";
import { CartItem } from "../_lib/types/cart/cart_item";

export default function CartPage() {
  const { user } = useContext(UserContext);
  const [items, setItems] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/");

    async function loadCartItems() {
      const cartItems = await api.get<CartItem[]>(`cart`);

      setItems(cartItems);
    }

    loadCartItems();
  }, []);

  const updateQty = async (id: number, delta: number) => {
    const item = items.find((item) => item.id === id);

    if (!item) return;

    const qty = Math.min(
      item.productSpec.stock,
      Math.max(1, item.quantity + delta),
    );

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: qty,
          };
        }
        return item;
      }),
    );
    await api.patch<CartItem>(`cart/${id}`, {
      quantity: qty,
    });
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    api.delete(`cart/${id}`);
  };

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + item.productSpec.productView.product.price * item.quantity,
        0,
      ),
    [items],
  );
  const shipping = subtotal === 0 ? 0 : subtotal >= 50000 ? 0 : 3500;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen font-body text-ink">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {/* 헤더 */}
        <header className="mb-10 flex items-end justify-between border-b pb-6 border-line">
          <div>
            <Link
              href={"/"}
              className="mb-1 font-mono text-xs tracking-widest uppercase text-moss"
            >
              Mall
            </Link>
            <h1 className="font-display text-4xl md:text-5xl">장바구니</h1>
          </div>
          <p className="hidden font-mono text-xs md:block text-ink-soft">
            {items.length}개 품목
          </p>
        </header>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
            {/* 상품 목록 */}
            <div>
              <div className="grid grid-cols-[auto_1fr_auto_auto] items-center text-ink-soft gap-4 pb-3 font-mono text-[11px] tracking-wider md:grid-cols-[64px_1fr_140px_110px_32px]">
                <span className="hidden md:block">품목</span>
                <span>상세</span>
                <span className="text-center">수량</span>
                <span className="text-right">금액</span>
                <span />
              </div>

              <ul>
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t py-5 md:grid-cols-[64px_1fr_140px_110px_32px] border-line"
                  >
                    <div className="relative col-span-3 flex h-16 w-16 items-center justify-center rounded-sm text-2xl md:col-span-1 bg-surface border border-line">
                      <Image
                        fill
                        src={item.productSpec.productView.images[0].secure_url}
                        alt={`cart item preview-${item.productSpec.productView.product.name}`}
                        loading="eager"
                        className="object-contain"
                      />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <p className="font-display text-lg leading-tight">
                        {`${item.productSpec.productView.product.name} ${item.productSpec.productView.color}-${item.productSpec.size}`}
                      </p>
                      <p className="mt-0.5 text-sm text-ink-soft">
                        {item.productSpec.productView.product.description}
                      </p>
                      {item.quantity >= item.productSpec.stock && (
                        <p className="mt-1 font-mono text-[11px] text-rust">
                          재고 {item.productSpec.stock}개 한정
                        </p>
                      )}
                    </div>

                    {/* 수량 스테퍼 */}
                    <div className="flex items-center justify-self-start md:justify-self-center">
                      <div className="flex items-center rounded-full border border-line bg-surface">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 rounded-full text-sm transition disabled:opacity-30"
                          aria-label={`${item.productSpec.productView.product.name} 수량 줄이기`}
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-mono text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          disabled={item.quantity >= item.productSpec.stock}
                          className="h-8 w-8 rounded-full text-sm transition disabled:opacity-30"
                          aria-label={`${item.productSpec.productView.product.name} 수량 늘리기`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <p className="justify-self-end font-mono text-sm md:text-right">
                      {won(
                        item.productSpec.productView.product.price *
                          item.quantity,
                      )}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="justify-self-end text-lg leading-none transition hover:opacity-60 md:justify-self-center"
                      style={{ color: "var(--rust)" }}
                      aria-label={`${item.productSpec.productView.product.name} 삭제`}
                      title="삭제"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 주문 요약 — 영수증 카드 */}
            <aside className="lg:sticky lg:top-10 lg:self-start">
              <div className="relative px-6 pb-4 pt-7 shadow-sm bg-surface">
                <p className="mb-5 font-mono text-xs tracking-widest text-moss">
                  ORDER SUMMARY
                </p>

                <dl className="space-y-2.5 font-mono text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">소계</dt>
                    <dd>{won(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">배송비</dt>
                    <dd>{shipping === 0 ? "무료" : won(shipping)}</dd>
                  </div>
                </dl>

                <div
                  className="my-5 border-t border-dashed border-line"
                  style={{ borderColor: "var(--line)" }}
                />

                <div className="flex items-baseline justify-between">
                  <span className="font-display text-lg">합계</span>
                  <span className="font-mono text-xl text-ochre">
                    {won(total)}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="mt-2 text-xs text-ink-soft">
                    {won(50000 - subtotal)} 더 담으면 무료 배송이에요.
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => router.push("/order")}
                  className="mt-7 w-full py-3.5 text-sm tracking-wide text-white transition hover:opacity-90 bg-ink"
                >
                  주문하기 · {won(total)}
                </button>

                <p className="mt-5 text-center text-[11px] text-ink-soft">
                  결제 시 이용약관에 동의하게 됩니다.
                </p>

                {/* 영수증 절취선 느낌의 하단 톱니 엣지 */}
                <div
                  aria-hidden
                  className="absolute -bottom-2 left-0 right-0 h-4"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, var(--bg) 25%, transparent 25.5%), linear-gradient(225deg, var(--bg) 25%, transparent 25.5%)",
                    backgroundSize: "24px 24px",
                    backgroundPosition: "0 0, 0 0",
                    backgroundColor: "var(--surface)",
                  }}
                />
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center border border-line py-24 text-center">
      <p className="mb-3 text-4xl">🛒</p>
      <p className="font-display text-xl">장바구니가 비어 있어요</p>
      <p className="mt-1.5 text-sm" style={{ color: "var(--ink-soft)" }}>
        마음에 드는 상품을 담아보세요.
      </p>
      <a
        href="/"
        className="mt-6 border border-ink px-6 py-2.5 text-sm transition hover:opacity-70"
      >
        쇼핑 계속하기
      </a>
    </div>
  );
}
