import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logDir = configService.get<string>('LOG_DIR', 'logs');
        const logLevel = configService.get<string>('LOG_LEVEL', 'info');

        // Logs dizinini oluştur
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }

        const logFormat = winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.errors({ stack: true }),
          winston.format.splat(),
          winston.format.json(),
        );

        const consoleFormat = winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(
            ({ timestamp, level, message, context, ...meta }) => {
              const contextStr = context ? `[${context}]` : '';
              const metaStr = Object.keys(meta).length
                ? ` ${JSON.stringify(meta)}`
                : '';
              return `${timestamp} ${level} ${contextStr} ${message}${metaStr}`;
            },
          ),
        );

        return {
          level: logLevel,
          format: logFormat,
          defaultMeta: { service: 'karanix-backend' },
          transports: [
            // Console transport (tüm seviyeler)
            new winston.transports.Console({
              format: consoleFormat,
            }),

            // Error log dosyası (sadece hatalar)
            new winston.transports.File({
              filename: path.join(logDir, 'error.log'),
              level: 'error',
              format: logFormat,
              maxsize: 5242880, // 5MB
              maxFiles: 5,
            }),

            // Combined log dosyası (tüm seviyeler)
            new winston.transports.File({
              filename: path.join(logDir, 'combined.log'),
              format: logFormat,
              maxsize: 5242880, // 5MB
              maxFiles: 5,
            }),

            // HTTP istekleri için ayrı log dosyası
            new winston.transports.File({
              filename: path.join(logDir, 'http.log'),
              level: 'info',
              format: logFormat,
              maxsize: 5242880, // 5MB
              maxFiles: 5,
            }),
          ],
        };
      },
    }),
  ],
})
export class LoggerModule {}

