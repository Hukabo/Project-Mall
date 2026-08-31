import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSpec } from '../product/entity/productSpec.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSpec])],
  controllers: [TestController],
  providers: [TestService],
})
export class testModule {}
