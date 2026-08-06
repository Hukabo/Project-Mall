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
import { CurrentUser } from '../types/current-user';
import { User } from 'src/domains/user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  // 로그인 유저 이메일, 비밀번호 검증 함수
  async validateUesr(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    const isPasswordMatch = await compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('not correct password');
    }

    return { id: user.id, username: user.username, roles: user.roles };
  }

  // jwt토큰 payload에서 추출된 유저id로 현재 유저 식별
  async validateJwtUser(userId: string) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException('User not found..');
    }

    const currentUser: CurrentUser = {
      id: user.id,
      username: user.username,
      roles: user.roles,
    };

    return currentUser;
  }

  async login(user: User) {
    const { accessToken, refreshToken } = await this.generateToken(user);

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(
      user.id,
      hashedRefreshToken,
    );

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(user: User) {
    const { accessToken, refreshToken } = await this.generateToken(user);

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(
      user.id,
      hashedRefreshToken,
    );

    return { id: user.id, accessToken, refreshToken };
  }

  async generateToken(user: User) {
    const payload: AuthJwtPayload = { sub: user.id, roles: user.roles };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return { accessToken, refreshToken };
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
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

  async logOut(userId: string) {
    await this.userService.updateHashedRefreshToken(userId, null);
  }
}
