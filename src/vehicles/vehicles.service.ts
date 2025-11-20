import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  VehicleHistory,
  VehicleHistoryDocument,
} from './schemas/vehicle-history.schema';
import {
  VehicleLastPing,
  VehicleLastPingDocument,
} from './schemas/vehicle-last-ping.schema';
import { CreateHeartbeatDto } from './dto/create-heartbeat.dto';
import { EventsGateway } from '../events/events.gateway';
import { OperationsService } from '../operations/operations.service';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(VehicleHistory.name)
    private vehicleHistoryModel: Model<VehicleHistoryDocument>,
    @InjectModel(VehicleLastPing.name)
    private vehicleLastPingModel: Model<VehicleLastPingDocument>,
    private eventsGateway: EventsGateway,
    private operationsService: OperationsService,
  ) {}

  async createHeartbeat(
    vehicleId: string,
    createHeartbeatDto: CreateHeartbeatDto,
  ) {
    const timestamp = createHeartbeatDto.timestamp
      ? new Date(createHeartbeatDto.timestamp)
      : new Date();

    const history = new this.vehicleHistoryModel({
      vehicle_id: vehicleId,
      location: { lat: createHeartbeatDto.lat, lng: createHeartbeatDto.lng },
      heading: createHeartbeatDto.heading,
      speed: createHeartbeatDto.speed,
      timestamp,
    });
    await history.save();

    await this.vehicleLastPingModel.findOneAndUpdate(
      { vehicle_id: vehicleId },
      {
        vehicle_id: vehicleId,
        location: { lat: createHeartbeatDto.lat, lng: createHeartbeatDto.lng },
        heading: createHeartbeatDto.heading,
        speed: createHeartbeatDto.speed,
        last_ping: timestamp,
      },
      { upsert: true, new: true },
    );

    const operation = await this.operationsService.findByVehicleId(vehicleId);
    const operationId = operation?._id?.toString();

    this.eventsGateway.emitVehiclePosition(
      vehicleId,
      {
        vehicle_id: vehicleId,
        lat: createHeartbeatDto.lat,
        lng: createHeartbeatDto.lng,
        heading: createHeartbeatDto.heading,
        speed: createHeartbeatDto.speed,
        timestamp: timestamp.toISOString(),
      },
      operationId,
    );

    return history;
  }

  async getHistory(vehicleId: string) {
    return this.vehicleHistoryModel
      .find({ vehicle_id: vehicleId })
      .sort({ timestamp: -1 })
      .limit(100)
      .exec();
  }
}
