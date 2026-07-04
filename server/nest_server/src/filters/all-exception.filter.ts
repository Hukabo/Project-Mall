import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { error } from 'console';
@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: string | object = 'Internal server error';
    let cause: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      body = exception.getResponse();
      cause = exception.cause;
    }

    const line = (char = '-', fallback = 100) =>
      char.repeat(process.stdout.columns ?? fallback);

    console.error(line());
    console.error('timestamp: ', new Date().toISOString());
    console.error(
      'PATH: ',
      httpAdapter.getRequestMethod(request),
      httpAdapter.getRequestUrl(request),
    );
    console.error('STATUS: ', status);
    console.error('BODY: ', body);
    if (cause) console.error('CAUSE: ', cause);
    console.error(line());

    httpAdapter.reply(response, body, status);
  }
}

/*
  httpAdapter란

  NestJS가 실제 HTTP 서버(Express/Fastify)랑 통신하기 위한 “추상화된 연결고리”

  Nest는 내부적으로 Express를 쓰기도 하고, Fastify를 쓰기도 하므로 만약 Express코드에서
  Fastify코드로 변경되는 순간 에러 발생

  이걸 막기 위한 게 httpAdapter

  위 코드처럼 httpAdapter에 res, req를 위임함으로써 에러를 방지
*/
