import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './domains/user/modules/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './domains/user/entities/user.entity';
import { logger } from './middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './config/db.config';
import { ProductModule } from './domains/product/modules/product.module';
import { CategoryModule } from './domains/category/modules/category.module';

@Module({
  imports: [
    UserModule,
    ProductModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [dbConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(dbConfig.asProvider()),
    CategoryModule, // 1
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}

/* 1
 Return value of the .asProvider() method
{
  imports: [ConfigModule.forFeature(databaseConfig)],
  useFactory: (configuration: ConfigType<typeof databaseConfig>) => configuration,
  inject: [databaseConfig.KEY] // 'database'
}
*/
