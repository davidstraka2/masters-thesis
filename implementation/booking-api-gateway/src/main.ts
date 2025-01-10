import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import supertokens from 'supertokens-node';
import { AppModule } from './app.module';
import { SupertokensExceptionFilter } from './auth/auth.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  app.enableCors({
    origin: [configService.get('corsOrigin')],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });
  app.useGlobalFilters(new SupertokensExceptionFilter());

  await app.listen(configService.get('port'), configService.get('hostname'));
}

bootstrap();
