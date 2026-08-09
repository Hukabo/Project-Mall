import { Product, ProductSpec } from "./product/product";

export interface CartItem {
  id: number;
  quantity: number;
  productSpec: ProductSpec;
}
