import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log('middle ware: ');
  console.log(
    `method: ${req.method}, from: ${req.ip}, to: ${req.originalUrl}, at: ${new Date().toLocaleString(
      'ko-KR',
      {
        timeZone: 'Asia/Seoul',
      },
    )}\n`,
  );
  next();
}
