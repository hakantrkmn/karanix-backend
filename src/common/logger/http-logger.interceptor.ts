import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, ip, body, query, params } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const duration = Date.now() - startTime;

          this.logger.info('HTTP Request', {
            context: 'HTTP',
            method,
            url: originalUrl,
            statusCode,
            duration: `${duration}ms`,
            ip,
            query: Object.keys(query).length > 0 ? query : undefined,
            params: Object.keys(params).length > 0 ? params : undefined,
            body:
              method !== 'GET' && Object.keys(body || {}).length > 0
                ? this.sanitizeBody(body)
                : undefined,
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error('HTTP Request Error', {
            context: 'HTTP',
            method,
            url: originalUrl,
            statusCode: error.status || 500,
            duration: `${duration}ms`,
            ip,
            error: error.message,
            stack: error.stack,
          });
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
    // Hassas bilgileri loglamadan çıkar
    const sensitiveFields = ['password', 'token', 'secret', 'authorization'];
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });
    return sanitized;
  }
}

