"use client";

import Image from "next/image";
import { useState } from "react";
import { optimizeImage } from "../_lib/util/common";

export default function ImageGallery({
  images,
}: {
  images: Image[] | undefined;
}) {
  const [selected, setSelected] = useState(0);

  if (!images?.length) {
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
          src={optimizeImage(images[selected].secure_url, 1000, 1000)}
          alt="상품 이미지"
          fill
          loading="eager"
          priority
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
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
                src={optimizeImage(image.secure_url, 150, 150)}
                alt={`썸네일 ${i + 1}`}
                fill
                className="object-contain"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
