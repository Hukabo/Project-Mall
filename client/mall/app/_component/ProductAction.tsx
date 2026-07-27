"use client";

import { useContext, useState } from "react";
import { Product } from "../_lib/types/product";
import { api } from "../_lib/api/api";
import { CartItem } from "../_lib/types/cart_item";
import { UserContext } from "../_lib/context/UserProvider";
import { useRouter } from "next/navigation";

export default function ProductActions({ product }: { product: Product }) {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock === 0;

  async function handleAddToCart() {
    if (!user) {
      alert("로그인 후 이용해주세요.");
      return router.push("/login");
    }

    const res = await api.post<CartItem>("cart", {
      productId: product.id,
      quantity: qty,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1000);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 수량 선택 */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">수량</span>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-surface">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-colors"
            aria-label="수량 감소"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-medium border-x border-gray-200 h-8 leading-8">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            disabled={qty >= product.stock}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-colors"
            aria-label="수량 증가"
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-400">
          총 {(product.price * qty).toLocaleString()}원
        </span>
      </div>

      {/* 버튼 */}
      <div className="flex gap-2">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 h-11 rounded-lg text-sm font-medium transition-colors border ${
            added
              ? "bg-green-50 border-green-300 text-green-700"
              : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {added ? "✓ 담겼습니다" : "장바구니"}
        </button>
        <button
          disabled={isOutOfStock}
          className="flex-1 h-11 rounded-lg text-sm font-medium bg-ink text-white hover:bg-ink/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isOutOfStock ? "품절" : "바로 구매"}
        </button>
        <button
          className="w-11 h-11 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
          aria-label="찜하기"
        >
          ♡
        </button>
      </div>
    </div>
  );
}
