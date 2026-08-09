import { api } from "@/app/_lib/api/api";
import { UserContext } from "@/app/_lib/context/UserProvider";
import { CartItem } from "@/app/_lib/types/cart_item";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function AddToCartBtn({
  onSubmit,
  added,
}: {
  onSubmit: Function;
  added: boolean;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onSubmit()}
        className={`flex-1 h-11 rounded-lg text-sm font-medium transition-colors border ${
          added
            ? "bg-green-50 border-green-300 text-green-700"
            : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {added ? "✓ 담겼습니다" : "장바구니"}
      </button>
      <button className="flex-1 h-11 rounded-lg text-sm font-medium bg-ink text-white hover:bg-ink/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        바로구매
      </button>
      <button
        className="w-11 h-11 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
        aria-label="찜하기"
      >
        ♡
      </button>
    </div>
  );
}
