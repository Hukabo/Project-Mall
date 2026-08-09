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

  const category = await ask('등록할 상품의 카테고리를 입력해주세요.\n:');
  const item_string = await ask(
    '등록할 상품 목록을 \", \"(으)로 구분하여 입력하세요.(예: 라이더 자켓, 크로스백)\n:',
  );
  const item_list = item_string.split(', ');
  const prompt = await ask('AI에게 입력할 프롬프트를 입력해주세요.\n:');

  const service = app.get(OpenAiGenerateProductService);

  await service.generate(category, item_list, prompt);

  await app.close();
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error('실패:', err);
  process.exit(1);
});
