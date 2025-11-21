import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { WinstonLogger } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Winston logger'ı kullan
  const winstonLogger = app.get(WINSTON_MODULE_PROVIDER);
  app.useLogger(new WinstonLogger(winstonLogger));

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  const logger = app.get(WINSTON_MODULE_PROVIDER);
  logger.info(`🚀 Application is running on: http://localhost:${port}/api`, {
    context: 'Bootstrap',
  });
}
void bootstrap();
