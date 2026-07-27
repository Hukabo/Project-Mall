import { notFound } from "next/navigation";
import { Props } from "../../_lib/types/props";
import { getProduct } from "../../_lib/api/product";
import { Product } from "../../_lib/types/product";
import Link from "next/link";
import ImageGallery from "../../_component/ImageGallery";
import ProductActions from "../../_component/ProductAction";

export default async function ProductPage({ params }: Props) {
  const id = Number((await params).id);

  if (isNaN(id)) notFound();

  const product: Product = await getProduct(id);

  if (!product) notFound();

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 브레드크럼 */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-rust transition-colors">
            홈
          </Link>
          <span>›</span>
          <Link href="/" className="hover:text-rust transition-colors">
            상품
          </Link>
          <span>›</span>
          {product.category && (
            <>
              <Link
                href={`/?search=${product.category.name}`}
                className="hover:text-rust transition-colors"
              >
                {product.category.name}
              </Link>
              <span>›</span>
            </>
          )}
          <span className="text-gray-600">{product.name}</span>
        </nav>

        {/* 상품 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* 이미지 */}
          <ImageGallery images={product.images} />

          {/* 상품 정보 */}
          <div className="flex flex-col gap-4">
            {/* 배지 */}
            <div className="flex gap-2">
              {product.category && (
                <span className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full">
                  {product.category.name}
                </span>
              )}
              {isOutOfStock && (
                <span className="text-xs font-medium bg-red-50 text-red-600 border border-red-100 px-2.5 py-1 rounded-full">
                  품절
                </span>
              )}
              {isLowStock && (
                <span className="text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full">
                  재고 {product.stock}개 남음
                </span>
              )}
              {!isOutOfStock && !isLowStock && (
                <span className="text-xs font-medium bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-full">
                  재고 있음
                </span>
              )}
            </div>

            {/* 상품명 */}
            <div>
              <h1 className="text-xl font-medium text-gray-900 leading-snug">
                {product.name}
              </h1>
              <p className="text-xs text-gray-400 mt-1">ID: {product.id}</p>
            </div>

            {/* 가격 */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-medium text-gray-900">
                {product.price.toLocaleString()}원
              </span>
            </div>

            <hr className="border-gray-100" />

            {/* 메타 정보 */}
            <table className="text-sm w-full">
              <tbody>
                <tr>
                  <td className="text-gray-400 py-1.5 w-16">재고</td>
                  <td className="text-gray-800 font-medium">
                    {product.stock.toLocaleString()}개
                  </td>
                </tr>
                <tr>
                  <td className="text-gray-400 py-1.5">배송</td>
                  <td className="text-gray-800 font-medium">내일 도착</td>
                </tr>
                <tr>
                  <td className="text-gray-400 py-1.5">등록일</td>
                  <td className="text-gray-800 font-medium">
                    {new Date(product.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              </tbody>
            </table>

            <hr className="border-gray-100" />

            {/* 수량 + 버튼 — 클라이언트 컴포넌트 */}
            <ProductActions product={product} />
          </div>
        </div>

        {/* 상품 설명 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex gap-4 border-b border-gray-100 mb-5">
            {["상품 설명", "배송 정보", "교환 / 반품"].map((tab, i) => (
              <button
                key={tab}
                className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  i === 0
                    ? "border-rust text-rust"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
