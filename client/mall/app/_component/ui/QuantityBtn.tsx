"use client";

import { useEffect, useState } from "react";

export default function QuantityBtn({
  id,
  quantity,
  stock,
  onChange,
}: {
  id: number;
  quantity: number;
  stock: number;
  onChange: Function;
}) {
  const [inputValue, setInputValue] = useState(String(quantity));

  useEffect(() => {
    console.log(inputValue);
    setInputValue(String(quantity));
  }, [quantity]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden bg-surface">
        <button
          onClick={() => onChange(id, Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-colors"
          aria-label="수량 감소"
        >
          −
        </button>
        <input
          min={1}
          max={stock}
          value={inputValue}
          type="number"
          className="w-10 text-center text-sm font-medium border-x border-gray-200 h-8 leading-8"
          onChange={(e) => {
            const value = e.target.value;

            if (+value > stock) {
              alert(`최대 ${stock}개 까지 주문 가능합니다.`);
              onChange(id, stock);
              return;
            }

            setInputValue(value);

            if (value === "") {
              return;
            }

            onChange(id, +value);
          }}
          onBlur={(e) => {
            if (e.target.value === "" || e.target.value === "0") {
              setInputValue("1");
              onChange(id, 1);
            }
          }}
        />
        <button
          onClick={() => onChange(id, Math.min(stock, quantity + 1))}
          disabled={quantity >= stock}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-colors"
          aria-label="수량 증가"
        >
          +
        </button>
      </div>
    </div>
  );
}
