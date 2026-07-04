export interface User {
  username: string;
  phone: string;
  address: string;
  role: Role;
}

enum Role {
  User,
  Admin,
}
