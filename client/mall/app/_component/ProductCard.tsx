import Image from "next/image";
import { Product } from "../_lib/types/product/product";
import { optimizeImage } from "../_lib/util/common";

export default function ProductCard(product: Product) {
  const thumbnail = product.thumbnail ?? null;

  return (
    <div className="w-full h-75 flex flex-col px-3 py-1.5 border border-grey-dark-3 shadow-dark cursor-pointer bg-grey-light-3 transition-all duration-300 hover:-translate-y-2.5">
      <div className="relative w-full h-50 overflow-hidden rounded-md self-center mb-3">
        {thumbnail ? (
          <Image
            src={optimizeImage(thumbnail, 400, 400)}
            alt={`product preview-${product.name}`}
            className="object-contain rounded-sm"
            fill
            sizes="200px"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
            <span className="text-sm">이미지 없음</span>
          </div>
        )}
      </div>
      <div className="">
        <p className="truncate font-light">{product.name}</p>
        <p>{product.price.toLocaleString()}원</p>
        <p>
          평점:{" "}
          <span className="text-ochre">
            &#9734;&#9734;&#9734;&#9734;&#9734; (0)
          </span>
        </p>
      </div>
    </div>
  );
}
