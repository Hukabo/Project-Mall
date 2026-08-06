"use client";

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useId,
  useState,
} from "react";
import { Variant } from "../_lib/types/product/variant";
import { VariantImage } from "../product/register/page";

interface ImageInputProps {
  variantIdx: number;
  images: VariantImage[];
  addImage: Function;
  removeImage: Function;
}

export default function ImageInput({
  variantIdx,
  images,
  addImage,
  removeImage,
}: ImageInputProps) {
  const inputId = useId();

  return (
    <>
      <input
        id={inputId}
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/jpg"
        multiple
        onChange={(e) => addImage(variantIdx, Array.from(e.target.files!))}
      />
      {/* 이미지 박스 */}
      <div className="flex gap-4 justify-around">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex-1 min-h-25 rounded-sm border border-dashed border-gray-400 overflow-hidden hover:border-ink transition-colors duration-300"
          >
            {images[index] ? (
              <img
                src={images[index].previewUrl}
                alt={`preview-${index}`}
                className="w-full h-full object-cover"
                onClick={() => removeImage(variantIdx, index)}
              />
            ) : (
              <>
                <label htmlFor={inputId}>
                  <div className="w-full h-full flex items-center justify-center text-gray-400 cursor-pointer">
                    +
                  </div>
                </label>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
