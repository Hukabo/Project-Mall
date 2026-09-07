import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/domains/product/entity/product.entity';
import { User } from 'src/domains/user/entity/user.entity';
import { LikeController } from '../controllers/like.controller';
import { Like } from '../entity/like.entity';
import { LikeService } from '../services/like.service';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Product, User])],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [TypeOrmModule],
})
export class LikeModule {}
