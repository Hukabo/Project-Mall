import { Product } from "./product";

export interface CartItem {
  id: number;
  quantity: number;
  cartId: { id: number };
  product: Product;
}
