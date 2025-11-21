import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LocationsModule } from './locations/locations.module';
import { OperationsModule } from './operations/operations.module';
import { PaxModule } from './pax/pax.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CustomersModule } from './customers/customers.module';
import { EventsModule } from './events/events.module';
import { LoggerModule } from './common/logger/logger.module';
import { HttpLoggerInterceptor } from './common/logger/http-logger.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    LocationsModule,
    OperationsModule,
    PaxModule,
    VehiclesModule,
    NotificationsModule,
    CustomersModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggerInterceptor,
    },
  ],
})
export class AppModule {}
