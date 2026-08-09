import {
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from '../guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';
import type { CookieOptions, Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { User } from 'src/domains/user/entity/user.entity';

@Controller('auth')
export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const user: User = req.user;

    const { accessToken, refreshToken } = await this.authService.login(user);

    this.setTokensToCookie(res, accessToken, refreshToken);

    return { message: 'login success', username: user.username };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshAccessToken(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { id, accessToken, refreshToken } =
      await this.authService.refreshAccessToken(req.user.id);

    this.setTokensToCookie(res, accessToken, refreshToken);

    return { userId: id };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('logout')
  logOut(@Req() req, @Res({ passthrough: true }) res: Response) {
    this.authService.logOut(req.user.id);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return { message: 'logout success' };
  }

  private setTokensToCookie(
    res: Response<any, Record<string, any>>,
    accessToken: string,
    refreshToken: string,
  ) {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    };

    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 3,
    });
  }
}
