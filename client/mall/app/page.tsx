"use client";

import Header from "./_component/Header";
import Sidebar from "./_component/Sidebar";
import { useContext, useEffect, useState } from "react";
import { getUser } from "./_lib/api/user";
import { UserContext } from "./_lib/context/UserProvider";
import { User } from "./_lib/types/user";
import { getAllProducts } from "./_lib/api/product";
import { Product } from "./_lib/types/product";
import ProductCard from "./_component/ProductCard";
import Link from "next/link";

export default function Home() {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const products = await getAllProducts();
      setProducts(products);
    }

    loadProducts();
  }, []);

  return (
    <>
      <Header user={user} />
      <main className="flex">
        <Sidebar />
        <section className="flex-1 p-7 grid grid-cols-(--grid-cols) grid-rows-(--grid-rows) gap-8">
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <ProductCard {...product} />
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}
