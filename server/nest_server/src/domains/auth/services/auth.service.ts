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
import * as argon2 from 'argon2';

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

  async login(userId: number) {
    // const payload: AuthJwtPayload = { sub: userId };

    // const token = this.jwtService.sign(payload);
    // const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);

    const { accessToken, refreshToken } = await this.generateToken(userId);

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return { id: userId, accessToken, refreshToken };
  }

  async refreshAccessToken(userId: number) {
    const { accessToken, refreshToken } = await this.generateToken(userId);

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);

    return { id: userId, accessToken, refreshToken };
  }

  async generateToken(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return { accessToken, refreshToken };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token..');
    }

    const isMatch = await argon2.verify(user.hashedRefreshToken, refreshToken);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token..');
    }

    return { id: userId };
  }

  async logOut(userId: number) {
    await this.userService.updateHashedRefreshToken(userId, undefined);
  }
}
