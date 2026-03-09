import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/domains/user/services/user.service';
import { AuthJwtPayload } from 'src/domains/auth/types/auth-jwtPayload';
import refreshJwtConfig from 'src/config/refresh-jwt.config';
import { type ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUesr(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials..');
    }

    return { id: user.id };
  }

  login(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);

    return { id: userId, token, refreshToken };
  }

  refreshToken(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const token = this.jwtService.sign(payload);

    return { id: userId, token };
  }
}
