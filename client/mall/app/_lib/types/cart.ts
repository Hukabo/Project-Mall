import { CartItem } from "./cart_item";

export interface Cart {
  id: number;
  cartItems: CartItem[];
}
