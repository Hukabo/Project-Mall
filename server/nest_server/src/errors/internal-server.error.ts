import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalServerError extends HttpException {
  constructor(message: string, error?: any) {
    super(
      {
        status: HttpStatus.NOT_ACCEPTABLE,
        message,
        error: 'Internal Server Error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      {
        cause: error,
      },
    );
  }
}
