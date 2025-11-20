import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.enableCors();

  // Request logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const httpLogger = new Logger('HTTP');
    const { method, originalUrl, ip } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      httpLogger.log(
        `${method} ${originalUrl} ${statusCode} ${duration}ms - ${ip}`,
      );
    });

    next();
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
void bootstrap();
