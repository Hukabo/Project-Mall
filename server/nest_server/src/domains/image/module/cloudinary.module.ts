import { Module } from '@nestjs/common';
import { CloudinaryProvider } from '../../../config/cloudinary.config';
import { CloudinaryService } from '../service/cloudinary.service';

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
