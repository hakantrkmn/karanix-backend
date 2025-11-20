import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocationsModule } from './locations/locations.module';
import { OperationsModule } from './operations/operations.module';
import { PaxModule } from './pax/pax.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EventsGateway } from './events/events.gateway';

@Module({
  imports: [
    LocationsModule,
    OperationsModule,
    PaxModule,
    VehiclesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
