import Image from "next/image";
import { Product } from "../_lib/types/product";

export default function ProductCard(product: Product) {
  const imageUrl = product.images
    ? `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/product/images/${product.images[0]}`
    : null;

  return (
    <div className="max-w-[200px] max-h-80 flex flex-col p-3 border border-grey-dark-3 shadow-dark cursor-pointer">
      <div className="relative w-45 h-45 overflow-hidden rounded-md self-center mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
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
      <p>평점: ★★★★★</p>
      <div className="flex justify-between items-center text-center h-8 mt-2.5">
        <span className="flex-1 border-r-grey-dark-2 border-r hover:bg-grey-light-3">
          담기
        </span>
        <span className="flex-1 hover:bg-grey-light-3">구매</span>
      </div>
    </div>
  );
}
