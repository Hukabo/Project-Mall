"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageGallery({ images }: { images: string[] }) {
  const [selected, setSelected] = useState(0);

  if (!images) {
    return (
      <div className="w-full aspect-square bg-surface rounded-xl flex items-center justify-center text-gray-400">
        <span className="text-sm">이미지 없음</span>
      </div>
    );
  }

  return (
    <div>
      {/* 대표 이미지 */}
      <div className="relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200 mb-2">
        <Image
          src={`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/product/images/${images[selected]}`}
          alt="상품 이미지"
          fill
          priority
          unoptimized
          className="object-cover"
        />
      </div>

      {/* 썸네일 */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((image, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative w-14 h-14 rounded-lg overflow-hidden border transition-all ${
                i === selected
                  ? "border-blue-500 border-[1.5px]"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/product/images/${image}`}
                alt={`썸네일 ${i + 1}`}
                fill
                unoptimized
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
