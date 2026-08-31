import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { TestService } from './test.service';
import { type ConcurrencyDto, concurrencySchema } from './dto/concurrency.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import * as os from 'node:os';

@Controller('test')
export class TestController {
  private readonly testService: TestService;
  constructor(testService: TestService) {
    this.testService = testService;
  }

  @Public()
  @Get()
  hello(): string {
    return 'hello';
  }

  @Public()
  @Get('/debug/metrics')
  getMetrics() {
    const memory = process.memoryUsage();

    return {
      cpu: process.cpuUsage(),
      memory: {
        rss: memory.rss,
        heapTotal: memory.heapTotal,
        heapUsed: memory.heapUsed,
        external: memory.external,
      },
      uptime: process.uptime(),
      loadAverage: os.loadavg(),
    };
  }

  @Public()
  @Post('withoutLock')
  async orderWithoutLock(
    @Body(new ValidationPipe(concurrencySchema)) dto: ConcurrencyDto,
  ) {
    const { productSpecId, quantity } = dto;
    return await this.testService.orderWithoutLock(productSpecId, quantity);
  }
  @Public()
  @Post('withLock')
  async orderWithPessimisticLock(
    @Body(new ValidationPipe(concurrencySchema)) dto: ConcurrencyDto,
  ) {
    const { productSpecId, quantity } = dto;
    return await this.testService.orderWithPessimisticLock(
      productSpecId,
      quantity,
    );
  }
  @Public()
  @Post('atomic')
  async orderWithAtomicUpdate(
    @Body(new ValidationPipe(concurrencySchema)) dto: ConcurrencyDto,
  ) {
    const { productSpecId, quantity } = dto;
    return await this.testService.orderWithAtomicUpdate(
      productSpecId,
      quantity,
    );
  }
}
