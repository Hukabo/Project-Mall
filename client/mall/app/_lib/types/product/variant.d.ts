import { VariantImage } from "@/app/product/register/page";
import { SizeStock } from "./size_stock";

export interface Variant {
  id: string;
  color: string;
  images: VariantImage[];
  sizeStocks: SizeStock[];
}
