import { registerAs } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage, memoryStorage } from 'multer';
import { C } from 'node_modules/@faker-js/faker/dist/index-BSUsvzGS';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig = MulterModule.register({
  // storage: diskStorage({
  //   destination: join(process.cwd(), 'asset', 'product_images'),
  //   filename: (_req, file, cb) => {
  //     const ext = extname(file.originalname);
  //     cb(null, `${uuidv4()}${ext}`);
  //   },
  // }),
  storage: memoryStorage(), //기존 로컬 스토리지에서 cloudinary 업로드를 위해서 메모리 스토리지로 변경
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    console.log('received files = ', file);
    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`지원하지 않는 파일 형식입니다: ${file.mimetype}`), false);
    }
  },
});
