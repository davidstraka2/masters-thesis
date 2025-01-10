import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';

import { AuthMiddleware } from './auth.middleware';
import { SupertokensService } from './supertokens.service';

@Module({
  providers: [],
  exports: [],
  controllers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  static forRoot(): DynamicModule {
    return {
      providers: [SupertokensService],
      exports: [],
      imports: [],
      module: AuthModule,
    };
  }
}
