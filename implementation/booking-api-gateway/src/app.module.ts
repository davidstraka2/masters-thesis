import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import config from './config';
import { IdMiddleware } from './id.middleware';
import { ProxyMiddleware } from './proxy.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    AuthModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdMiddleware).forRoutes('api');
    consumer.apply(ProxyMiddleware).forRoutes('users', 'api');
  }
}
