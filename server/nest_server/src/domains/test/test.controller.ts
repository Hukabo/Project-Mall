import { Controller, Get, Response } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  hello(): string {
    return 'hello';
  }
}
