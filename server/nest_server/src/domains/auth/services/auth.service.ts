import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserService } from 'src/domains/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUesr(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials..');
    }

    return { id: user.id };
  }
}
