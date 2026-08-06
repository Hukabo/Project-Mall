import { Variant } from "./variant";

export interface CreateProductForm {
  name: string;
  price: number;
  description: string;
  variants: Variant[];
  categoryId: string;
}
