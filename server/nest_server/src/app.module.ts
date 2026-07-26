import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './domains/user/modules/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { logger } from './middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './config/db.config';
import { ProductModule } from './domains/product/modules/product.module';
import { CategoryModule } from './domains/category/modules/category.module';
import { CartModule } from './domains/cart/modules/cart.module';
import { OrderModule } from './domains/order/modules/order.module';
import { AuthModule } from './domains/auth/modules/auth.module';
import { testModule } from './domains/test/test.module';
import { PaymentModule } from './domains/payment/modules/payment.module';

@Module({
  imports: [
    AuthModule,
    testModule,
    UserModule,
    ProductModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [dbConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(dbConfig.asProvider()), // 1
    CategoryModule,
    CartModule,
    OrderModule,
    PaymentModule,
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
