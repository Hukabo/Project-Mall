"use client";

import Link from "next/link";
import ImageGallery from "./ImageGallery";
import ProductActions from "./QuantityBtn";
import {
  Product,
  ProductSpec,
  ProductView,
} from "@/app/_lib/types/product/product";
import { useContext, useEffect, useState } from "react";
import { won } from "@/app/_lib/util/common";
import { SizeStock } from "@/app/_lib/types/product/size_stock";
import QuantityBtn from "./QuantityBtn";
import AddToCartBtn from "./AddToCartBtn";
import { api } from "@/app/_lib/api/api";
import { UserContext } from "@/app/_lib/provider/UserProvider";
import { useRouter } from "next/navigation";

interface Item {
  id: number; // specId
  stock: number;
  quantity: number;
  size: string;
  color: string;
}

export default function ProductClient({ product }: { product: Product }) {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const [current, setCurrent] = useState<ProductView>(product.productViews[0]);
  const [itemList, setItemList] = useState<Item[]>([]);
  const [added, setAdded] = useState(false);
  const views = product.productViews;
  const total = itemList.reduce(
    (sum, item) => sum + item.quantity * product.price,
    0,
  );

  function addItem(id: number) {
    const spec = current.productSpecs.find((s) => s.id === id);

    if (!spec) {
      return;
    }

    setItemList((prev) => {
      if (prev.some((item) => item.id === spec.id)) {
        alert("이미 선택된 옵션입니다.");
        return prev;
      }

      return [
        ...prev,
        {
          id: spec.id,
          stock: spec.stock,
          quantity: 1,
          size: spec.size,
          color: current.color,
        },
      ];
    });
  }

  function removeItem(id: number) {
    setItemList((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  }

  function setQuantity(id: number, quantity: number) {
    console.log(quantity);
    setItemList((prev) => {
      return prev.map((item) =>
        item.id !== id ? item : { ...item, quantity },
      );
    });
  }

  async function addtoCart() {
    console.log(user);
    if (!user) {
      alert("로그인 후 이용해주세요");
      router.push("/login");
    }

    if (itemList.length === 0) {
      alert("담긴 상품이 없습니다.");
      return;
    }

    const res = await api.post("cart", { cartItems: itemList });
    console.log(res);

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1000);
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 브레드크럼 */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-rust transition-colors">
            홈
          </Link>
          <span>›</span>
          <Link href="/" className="hover:text-rust transition-colors">
            상품
          </Link>
          <span>›</span>
          {product.category && (
            <>
              <Link
                href={`/?search=${product.category.name}`}
                className="hover:text-rust transition-colors"
              >
                {product.category.name}
              </Link>
              <span>›</span>
            </>
          )}
          <span className="text-gray-600">{product.name}</span>
        </nav>

        {/* 상품 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* 이미지 */}
          <ImageGallery images={current.images} />

          {/* 상품 정보 */}
          <div className="flex flex-col gap-4">
            {/* 상품명 */}
            <div>
              <h1 className="text-xl font-medium text-gray-900 leading-snug">
                {`${product.name} ${current.color}`}
              </h1>
            </div>

            {/* 가격 */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-medium text-gray-900">
                {won(product.price)}
              </span>
            </div>

            <hr className="border-gray-100" />

            {/* 메타 정보 */}
            <table className="text-sm w-full">
              <tbody>
                <tr>
                  <td className="text-gray-400 py-1.5">배송</td>
                  <td className="text-gray-800 font-medium">내일 도착</td>
                </tr>
                <tr>
                  <td className="text-gray-400 py-1.5">등록일</td>
                  <td className="text-gray-800 font-medium">
                    {new Date(product.timeStamp.createdAt).toLocaleString(
                      "ko-KR",
                      {
                        timeZone: "Asia/Seoul",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      },
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <hr className="border-gray-100" />

            {current.color && (
              <div>
                <p className="text-sm text-gray-500">색상</p>
                <select
                  id="color"
                  name="color"
                  className="bg-surface p-2 w-1/2 rounded-sm text-grey-dark-1 border border-line focus:outline-none"
                  onChange={(e) => {
                    const id = +e.target.value;

                    const newCurrent = views.find((v) => v.id === id);
                    if (newCurrent) {
                      setCurrent(newCurrent);
                    }
                  }}
                >
                  {views.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.color}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">사이즈</p>
              <select
                name="size"
                id="size"
                className="bg-surface p-2 w-1/2 rounded-sm text-grey-dark-1 border border-line focus:outline-none"
                value=""
                onChange={(e) => addItem(+e.target.value)}
              >
                <option value="">SIZE</option>
                {current &&
                  current.productSpecs.map((s) => (
                    <option key={s.id} value={s.id} disabled={s.stock === 0}>
                      {s.size}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <ul
                className={`${itemList.length > 0 ? "block" : "hidden"} bg-surface py-2 px-6 border border-line rounded-sm text-gray-600`}
              >
                {itemList.length > 0 && (
                  <>
                    {[...itemList]
                      .sort((a, b) => a.id - b.id)
                      .map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-2 not-last:mb-1.5"
                        >
                          <span>{`${item.color} ${item.size}`}</span>
                          <div className="flex gap-2 items-center">
                            <QuantityBtn
                              id={item.id}
                              stock={item.stock}
                              quantity={item.quantity}
                              onChange={setQuantity}
                            />
                            <span className="text-ink font-semibold">
                              {won(product.price)}
                            </span>
                            <button
                              className="cursor-pointer"
                              type="button"
                              onClick={() => removeItem(item.id)}
                            >
                              &times;
                            </button>
                          </div>
                        </li>
                      ))}
                    <div className="flex items-center justify-end mt-4">
                      <span className="text-sm  text-ink">
                        총 상품 금액{" "}
                        <span className="text-lg font-semibold text-rust">
                          {won(total)}
                        </span>
                      </span>
                    </div>
                  </>
                )}
              </ul>
            </div>

            <AddToCartBtn onSubmit={addtoCart} added={added} />
          </div>
        </div>

        {/* 상품 설명 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex gap-4 border-b border-gray-100 mb-5">
            {["상품 설명", "배송 정보", "교환 / 반품"].map((tab, i) => (
              <button
                key={tab}
                className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  i === 0
                    ? "border-rust text-rust"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
