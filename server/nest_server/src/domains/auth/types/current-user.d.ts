import { Role } from 'src/enums/role.enum';

export type CurrentUser = {
  id: string;
  username: string;
  roles: Role[];
};
