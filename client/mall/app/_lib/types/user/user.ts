import { Cart } from "../cart/cart";

export interface User {
  id: string;
  email: string;
  username: string;
  phone: string;
  address: string;
  roles: string[];
  cart: Cart;
}

// enum Role {
//   User,
//   Admin,
// }
