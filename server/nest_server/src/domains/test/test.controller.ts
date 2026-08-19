import { Controller, Get, Response } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';

@Controller('test')
export class TestController {
  @Public()
  @Get()
  hello(): string {
    return 'hello';
  }
}
