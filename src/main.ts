import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerDocument } from './shared/helpers';
import { ErrorsInterceptor } from './shared/interceptors/errors.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'log'] });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    validateCustomDecorators: true
  }));
  app.useGlobalInterceptors(new ErrorsInterceptor());

  SwaggerModule.setup('api', app, swaggerDocument(app));

  await app.listen(3000);
}

bootstrap();
