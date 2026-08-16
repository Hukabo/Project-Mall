import { NestFactory } from '@nestjs/core';
import * as readline from 'readline';
import { OpenAiGenerateProductModule } from './generateProduct.module';
import { OpenAiGenerateProductService } from './generateProduct.service';

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    OpenAiGenerateProductModule,
  );

  const item_string = await ask(
    '등록할 상품 목록을 \"&\"(으)로 구분하여 입력하세요.(예: 라이더 자켓&크로스백)\n:',
  );
  const items = item_string.split('&');

  const service = app.get(OpenAiGenerateProductService);

  console.log('상품 생성 시작');

  await service.generate(items);

  console.log('전체 상품 생성 완료');
  await app.close();
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error('실패:', err);
  process.exit(1);
});
