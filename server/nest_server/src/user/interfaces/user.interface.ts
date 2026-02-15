import { Role } from 'src/enums/role.enum';

export interface UserSchema {
  email: string;
  password: string;
  username: string;
  birth: string;
  address: string;
  roles: Role[];
}
