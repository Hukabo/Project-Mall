import { Cart } from "./cart";

export interface User {
  id: number;
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
