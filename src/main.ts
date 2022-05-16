import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ErrorsInterceptor } from './shared/interceptors/errors.interceptor';
import { swaggerSetup } from './shared/helpers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'log'] });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    validateCustomDecorators: true
  }));
  app.useGlobalInterceptors(new ErrorsInterceptor());
  swaggerSetup(app);

  await app.listen(3000);
}

bootstrap();
