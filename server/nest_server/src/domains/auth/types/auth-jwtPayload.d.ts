import { Role } from 'src/enums/role.enum';

export type AuthJwtPayload = {
  sub: string;
  roles: Role[];
};
