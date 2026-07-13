"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "../_lib/types/product";
import { getProducts } from "../_lib/api/product";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(true);

  useEffect(() => {
    async function loadProducts() {
      const { products, limit, total, hasNext } = await getProducts(page, 30);

      setProducts(products);
    }

    loadProducts();
  }, []);

  return (
    <section className="flex-1 p-7 grid grid-cols-(--grid-cols) grid-rows-(--grid-rows) gap-8">
      {products.map((product) => (
        <Link key={product.id} href={`/product/${product.id}`}>
          <ProductCard {...product} />
        </Link>
      ))}
    </section>
  );
}
