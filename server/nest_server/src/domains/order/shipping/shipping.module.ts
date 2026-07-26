import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipping } from './shipping.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shipping])],
})
export class ShippingModule {}
