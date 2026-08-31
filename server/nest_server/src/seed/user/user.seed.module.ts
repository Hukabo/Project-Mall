import { Module } from '@nestjs/common';
import { UserSeedService } from './user.seed.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from 'src/config/db.config';
import { User } from 'src/domains/user/entity/user.entity';
import { Cart } from 'src/domains/cart/entity/cart.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [dbConfig] }),
    TypeOrmModule.forRootAsync(dbConfig.asProvider()),
    TypeOrmModule.forFeature([User, Cart]),
  ],
  providers: [UserSeedService],
})
export class UserSeedModule {}
