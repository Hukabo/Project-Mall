import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/domains/cart/entity/cart.entity';
import { User } from 'src/domains/user/entity/user.entity';
import { Role } from 'src/enums/role.enum';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async seed(count: number) {
    const seedUsers: User[] = [];

    for (let i = 0; i < count; i++) {
      const user = this.userRepository.create({
        email: `test${i + 1}@test.com`,
        password: '123123123a!',
        username: `test-${i + 1}`,
        birth: 'test',
        phone: 'test',
        roles: [Role.USER],
      });

      const cart = this.cartRepository.create({ user });

      user.cart = cart;
      seedUsers.push(user);
    }

    await this.userRepository.save(seedUsers);
  }
}
