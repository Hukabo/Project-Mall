import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../entity/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  exports: [TypeOrmModule],
})
export class AddressModule {}
