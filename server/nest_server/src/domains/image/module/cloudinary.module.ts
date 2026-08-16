import { Module } from '@nestjs/common';
import { CloudinaryProvider } from '../../../config/cloudinary.config';
import { CloudinaryService } from '../service/cloudinary.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
