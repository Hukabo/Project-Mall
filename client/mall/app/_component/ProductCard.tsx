import Image from "next/image";
import { Product } from "../_lib/types/product";

export default function ProductCard(product: Product) {
  return (
    <div className="flex flex-col p-3 border border-grey-dark-3 shadow-dark cursor-pointer">
      <div className="relative w-45 h-45 overflow-hidden rounded-md self-center mb-3">
        <Image
          src={`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/product/images/${product.images[0]}`}
          alt={`product preview-${product.name}`}
          fill
          unoptimized
          loading="eager"
          className="h-auto object-cover"
        ></Image>
      </div>

      <p>{product.name}</p>
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
