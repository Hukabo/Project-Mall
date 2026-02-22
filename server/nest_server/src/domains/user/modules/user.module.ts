import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { CartModule } from 'src/domains/cart/modules/cart.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CartModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

// 유저 모듈을 다른 모듈에서 쓰고 싶을 경우

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './user.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([User])],
//   exports: [TypeOrmModule],
// })
// export class UsersModule {}
