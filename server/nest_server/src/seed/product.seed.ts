// 실행: npx ts-node -r tsconfig-paths/register src/seed/product.seed.ts

import { NestFactory } from '@nestjs/core';
import { ProductSeedModule } from './product.seed.module';
import { ProductSeedService } from './product.seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(ProductSeedModule);
  const seedService = app.get(ProductSeedService);

  await seedService.seed(100); // 원하는 개수 조절

  await app.close();
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error('시딩 실패:', err);
  process.exit(1);
});
