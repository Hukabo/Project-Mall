import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { LikeService } from '../services/like.service';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':productId')
  toggle(
    @CurrentUser('id') userId: string,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.likeService.toggle(userId, productId);
  }

  @Get(':productId')
  isLiked(
    @CurrentUser('id') userId: string,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.likeService.isLiked(userId, productId);
  }
}
