import { Role } from 'src/enums/role.enum';

export type CurrentUser = {
  id: number;
  username: string;
  roles: Role[];
};
