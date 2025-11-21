# Logger Modülü

Bu modül, NestJS uygulamasında tüm işlemleri loglamak ve dosyaya yazmak için Winston kullanır.

## Özellikler

- ✅ Console'a renkli loglar (development)
- ✅ Dosyaya yazma (production)
- ✅ Log seviyeleri: error, warn, info, debug, verbose
- ✅ Otomatik log rotation (5MB, 5 dosya)
- ✅ HTTP istek logları (interceptor ile)
- ✅ Hassas bilgilerin otomatik gizlenmesi (password, token, vb.)

## Log Dosyaları

Log dosyaları `logs/` dizininde oluşturulur:

- `error.log`: Sadece hata logları
- `combined.log`: Tüm log seviyeleri
- `http.log`: HTTP istek logları

## Kullanım

### Servislerde Logger Kullanımı

```typescript
import { Injectable } from '@nestjs/common';
import { Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class MyService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  someMethod() {
    this.logger.info('İşlem başladı', { context: 'MyService' });
    this.logger.error('Hata oluştu', { context: 'MyService', error: '...' });
    this.logger.warn('Uyarı', { context: 'MyService' });
    this.logger.debug('Debug bilgisi', { context: 'MyService' });
  }
}
```

### Controller'larda Logger Kullanımı

```typescript
import { Controller, Get } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('example')
export class ExampleController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  findAll() {
    this.logger.info('GET /example çağrıldı', { context: 'ExampleController' });
    return [];
  }
}
```

## HTTP Logger Interceptor

HTTP istekleri otomatik olarak loglanır. Her istek için şu bilgiler kaydedilir:

- HTTP method (GET, POST, vb.)
- URL
- Status code
- İşlem süresi
- IP adresi
- Query parametreleri
- Request body (hassas bilgiler gizlenir)

## Environment Variables

`.env` dosyasında:

```env
LOG_DIR=logs          # Log dosyalarının dizini
LOG_LEVEL=info        # Log seviyesi (error, warn, info, debug, verbose)
```

## Log Formatı

### Console (Development)
```
2024-01-15 10:30:45 info [MyService] İşlem başladı
```

### Dosya (JSON Format)
```json
{
  "timestamp": "2024-01-15 10:30:45",
  "level": "info",
  "message": "İşlem başladı",
  "context": "MyService",
  "service": "karanix-backend"
}
```

