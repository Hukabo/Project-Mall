import { Cart } from "../cart/cart";

export interface User {
  id: string;
  email: string;
  username: string;
  phone: string;
  address: AddressForm;
  roles: string[];
  cart: Cart;
}

// enum Role {
//   User,
//   Admin,
// }
