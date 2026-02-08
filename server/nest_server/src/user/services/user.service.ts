import { Injectable } from '@nestjs/common';
import { User } from '../interfaces/user.interface';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

  create(user: User) {
    this.users.push(user);

    return;
  }

  findAll(): User[] {
    return this.users;
  }
}
