import { notFound } from "next/navigation";
import { Props } from "../../_lib/types/props";

import { Product } from "../../_lib/types/product/product";
import Link from "next/link";
import ImageGallery from "../../_component/ImageGallery";
import ProductActions from "../../_component/QuantityBtn";
import { api } from "@/app/_lib/api/api";
import { useState } from "react";
import ProductClient from "@/app/_component/product/ProductClient";

export default async function ProductPage({ params }: Props) {
  const id = Number((await params).id);

  if (isNaN(id)) notFound();

  const product: Product = await api.get<Product>(`product/${id}`);

  if (!product) notFound();

  return <ProductClient product={product} />;
}
