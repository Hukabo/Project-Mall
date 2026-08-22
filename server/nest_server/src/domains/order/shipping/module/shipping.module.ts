import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipping } from '../entity/shipping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shipping])],
})
export class ShippingModule {}
