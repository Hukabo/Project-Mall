import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { LocalStrategy } from '../strategies/local.stragegy';
import { UserService } from 'src/domains/user/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domains/user/entity/user.entity';
import { Cart } from 'src/domains/cart/entity/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart])],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, UserService],
})
export class AuthModule {}
