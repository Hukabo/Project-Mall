import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppdataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!, 10) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [join(__dirname, '..', '/domains/**/entity/*.entity{.js,.ts}')],
  synchronize: false,
  migrations: [join(__dirname, '..', '/migrations/**/*{.js,.ts}')],
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  extra:
    process.env.NODE_ENV === 'production'
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
          max: 30,

          // 큐에서 DB 커넥션을 얻기 위해 대기하는 최대 시간 (밀리초)
          // 5초 동안 커넥션을 못 얻으면 대기 타임아웃 에러를 발생시켜 NestJS 로그에 찍히게 만듦.
          connectionTimeoutMillis: 5000,

          // 쿼리 하나가 수행되는 최대 시간 제한 (예: 10초)
          // 특정 쿼리가 락(Lock)이나 인덱스 누락으로 밀리는 경우 강제로 끊어 풀을 반환 시킴.
          statement_timeout: 10000,

          // 연결이 유휴(Idle) 상태일 때 풀에서 제거되기까지의 시간
          idleTimeoutMillis: 30000,
        }
      : { max: 30 },
});
