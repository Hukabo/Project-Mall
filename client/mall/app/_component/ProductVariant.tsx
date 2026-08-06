"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ImageInput from "./ImageInput";
import { Variant } from "../_lib/types/product/variant";
import { SizeStock } from "../_lib/types/product/size_stock";
import { CreateProductForm } from "../_lib/types/product/create_product_form";

interface ProductVariantOptions {
  variantIdx: number;
  variant: Variant;
  changeColor: (variantIdx: number, color: string) => void;
  addImage: (variantIdx: number, files: File[]) => void;
  removeImage: (variantIdx: number, imageIdx: number) => void;
  handleSizeStock: (
    variantIdx: number,
    size: string,
    stock: number | string,
  ) => void;
  removeVariant: (variantIdx: number) => void;
}

export default function ProductVariant({
  variantIdx,
  variant,
  changeColor,
  addImage,
  removeImage,
  handleSizeStock,
  removeVariant,
}: ProductVariantOptions) {
  return (
    <div className="flex gap-2 border border-line rounded-sm mx-4 p-4">
      {/* 왼쪽 파트 */}
      <div className="flex-1 flex flex-col gap-3">
        <div>
          <label htmlFor="color">
            <span className="text-line mr-1">2-1</span>색상 이름
          </label>
          <input
            type="text"
            id="color"
            name="color"
            placeholder="예: 화이트"
            className="block mt-2 bg-white p-2 rounded-sm focus:outline-none border border-line"
            onChange={(e) => changeColor(variantIdx, e.target.value)}
          />
        </div>
        {/* 이미지 필드 */}
        <ImageInput
          variantIdx={variantIdx}
          images={variant.images}
          addImage={addImage}
          removeImage={removeImage}
        />
      </div>
      {/* 오른쪽 파트 */}
      <div className="flex-1 flex flex-col border-l border-line border-dashed pl-2">
        <div className="flex justify-between items-center">
          <p>
            <span className="text-line mr-1">2-2</span>사이즈 & 재고
          </p>
          <button
            type="button"
            className="text-[1.3rem] text-grey-dark-2 hover:text-red-400 mr-2"
            onClick={() => removeVariant(variantIdx)}
          >
            &times;
          </button>
        </div>
        <div className="flex gap-2 flex-wrap text-gray-500 pt-2">
          {variant.sizeStocks.map((sizeStock, index) => (
            <div
              key={index}
              className="min-w-25 flex-1 flex-col p-2 border border-line rounded-sm text-center"
            >
              <label htmlFor={`${sizeStock.size}`}>{sizeStock.size}</label>
              <input
                id={`${sizeStock.size}`}
                name={`${sizeStock.size}`}
                type="number"
                value={sizeStock.stock}
                className="w-full block bg-white p-1 rounded-sm focus:outline-none border border-line text-center"
                onChange={(e) =>
                  handleSizeStock(variantIdx, sizeStock.size, e.target.value)
                }
                onFocus={(e) => {
                  if (e.target.value === "0") {
                    handleSizeStock(variantIdx, sizeStock.size, "");
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    handleSizeStock(variantIdx, sizeStock.size, "0");
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
