import { Product } from "./product/product";

export interface CartItem {
  id: number;
  quantity: number;
  cartId: number;
  product: Product;
}
