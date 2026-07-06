import { Role } from 'src/enums/role.enum';

export type AuthJwtPayload = {
  sub: number;
  roles: Role[];
};
