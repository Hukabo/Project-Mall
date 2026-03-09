import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { StringValue } from 'ms';

export default registerAs(
  'refresh-jwt',
  (): JwtSignOptions => ({
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRE_IN as StringValue,
  }),
);
