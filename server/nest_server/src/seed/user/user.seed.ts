import { NestFactory } from '@nestjs/core';
import { UserSeedModule } from './user.seed.module';
import { UserSeedService } from './user.seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(UserSeedModule);
  const seedService = app.get(UserSeedService);

  try {
    await seedService.seed(100); // 원하는 개수 조절

    await app.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
  }
}

bootstrap().catch((err) => {
  console.error('시딩 실패:', err);
  process.exit(1);
});
