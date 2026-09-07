import Image from "next/image";
import { Product } from "../../_lib/types/product/product";
import { optimizeImage, won } from "../../_lib/util/common";

export default function ProductCard(product: Product) {
  const thumbnail = product.thumbnail ?? null;

  return (
    <div className="group flex w-full flex-col border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-moss/40 hover:shadow-lg">
      <div className="relative w-full aspect-square overflow-hidden bg-grey-light-2">
        {thumbnail ? (
          <Image
            src={optimizeImage(thumbnail, 400, 400)}
            alt={`product preview-${product.name}`}
            className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
            fill
            sizes="200px"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-soft">
            <span className="font-mono text-xs uppercase tracking-widest">
              이미지 없음
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 px-4 py-3.5">
        <p className="truncate font-display text-base text-ink">
          {product.name}
        </p>
        <p className="font-mono text-sm text-ochre">{won(product.price)}</p>
        <p className="font-mono text-xs text-ink-soft">
          평점: <span className="text-ochre">★★★★★</span> (0)
        </p>
      </div>
    </div>
  );
}
