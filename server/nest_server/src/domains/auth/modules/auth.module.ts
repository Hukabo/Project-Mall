import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { LocalStrategy } from '../strategies/local.stragegy';
import { UserService } from 'src/domains/user/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domains/user/entity/user.entity';
import { Cart } from 'src/domains/cart/entity/cart.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Cart]),
    JwtModule.registerAsync(jwtConfig.asProvider()), // JwtService 생성, secret, expiresIn 설정
    ConfigModule.forFeature(jwtConfig), // jwtConfig 주입
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService],
})
export class AuthModule {}
