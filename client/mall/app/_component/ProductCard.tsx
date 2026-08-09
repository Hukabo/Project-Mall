import Image from "next/image";
import { Product } from "../_lib/types/product/product";

export default function ProductCard(product: Product) {
  const thumbnail = product.thumbnail ?? null;

  return (
    <div className="max-w-50 max-h-80 flex flex-col p-3 border border-grey-dark-3 shadow-dark cursor-pointer bg-grey-light-3 transition-all duration-300 hover:-translate-y-2.5">
      <div className="relative w-45 h-45 overflow-hidden rounded-md self-center mb-3">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={`product preview-${product.name}`}
            fill
            unoptimized
            loading="eager"
            className="h-auto object-cover"
          />
        ) : (
          <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
            <span className="text-sm">이미지 없음</span>
          </div>
        )}
      </div>

      <p className="truncate font-light">{product.name}</p>
      <p>{product.price.toLocaleString()}원</p>
      <p>
        평점:{" "}
        <span className="text-ochre">
          &#9734;&#9734;&#9734;&#9734;&#9734; (0)
        </span>
      </p>
    </div>
  );
}
