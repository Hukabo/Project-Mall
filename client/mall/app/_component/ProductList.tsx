"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { PageResponse, Product } from "../_lib/types/product/product";

import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "./Loading";
import { useSearchParams } from "next/navigation";
import { api } from "../_lib/api/api";

export default function ProductList() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const page = useRef<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(true);

  const loadProducts = useCallback(
    async (pageToLoad: number, search: string, append: boolean) => {
      const { products, hasNext } = await api.get<PageResponse>("product", {
        params: {
          page: pageToLoad,
          limit: 20,
          search,
        },
      });
      setProducts((prev) => (append ? [...prev, ...products] : products));
      page.current = pageToLoad + 1;
      setHasNext(hasNext);
    },
    [],
  );

  useEffect(() => {
    loadProducts(1, search, false);
    console.log("products = ", products);
  }, [search]);

  async function fetchMore() {
    if (!hasNext) return;

    loadProducts(page.current, search, true);
  }

  return (
    <InfiniteScroll
      className="flex-1 p-7 grid grid-cols-(--grid-cols) grid-rows-(--grid-rows) gap-8"
      dataLength={products.length}
      next={fetchMore}
      hasMore={hasNext}
      loader={<Loading />}
      // endMessage={<p style={{ textAlign: "center" }}>All items loaded.</p>}
    >
      {[
        ...new Map(products.map((product) => [product.id, product])).values(),
      ].map((product, i) => (
        <Link key={`index-${i}`} href={`/product/${product.id}`}>
          <ProductCard {...product} />
        </Link>
      ))}
    </InfiniteScroll>
  );
}
