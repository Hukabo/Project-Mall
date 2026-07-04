import { Role } from 'src/enums/role.enum';
import { User } from '../entity/user.entity';

export class ResponseUserDto {
  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.roles = user.roles;
  }

  id: number;
  username: string;
  roles: Role[];
}
