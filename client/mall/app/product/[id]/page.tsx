import { notFound } from "next/navigation";
import { Props } from "../../_lib/types/props/props";
import { Product } from "../../_lib/types/product/product";
import { api } from "@/app/_lib/api/api";
import ProductClient from "@/app/_component/ProductClient";

export default async function ProductPage({ params }: Props) {
  const id = Number((await params).id);

  if (isNaN(id)) notFound();

  const product: Product = await api.get<Product>(`product/${id}`);

  if (!product) notFound();

  return <ProductClient product={product} />;
}
