import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pax, PaxDocument } from './schemas/pax.schema';
import { CheckInDto } from './dto/check-in.dto';
import { CreatePaxDto } from './dto/create-pax.dto';
import { EventsGateway } from '../events/events.gateway';
import {
  Operation,
  OperationDocument,
} from '../operations/schemas/operation.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from 'src/notifications/types/notification.types';
import { PaxStatus } from './types/pax.types';

@Injectable()
export class PaxService {
  constructor(
    @InjectModel(Pax.name) private paxModel: Model<PaxDocument>,
    @InjectModel(Operation.name)
    private operationModel: Model<OperationDocument>,
    private eventsGateway: EventsGateway,
    private notificationsService: NotificationsService,
  ) {}

  async create(createPaxDto: CreatePaxDto) {
    const pax = new this.paxModel(createPaxDto);
    return pax.save();
  }

  async checkIn(id: string, checkInDto: CheckInDto) {
    const pax = await this.paxModel.findById(id);
    if (!pax) {
      throw new BadRequestException('Pax not found');
    }

    if (pax.checkin_event_id === checkInDto.eventId) {
      return pax;
    }

    pax.status = PaxStatus.CHECKED_IN;
    pax.checkin_event_id = checkInDto.eventId;
    await pax.save();

    if (pax.operation_id) {
      const operation = await this.operationModel.findById(pax.operation_id);
      if (operation) {
        operation.checked_in_count = (operation.checked_in_count || 0) + 1;
        await operation.save();

        await this.notificationsService.create({
          message: `Pax ${pax.name} checked in for operation ${operation.code || operation.tour_name}`,
          type: NotificationType.INFO,
          related_id: pax.operation_id.toString(),
        });
      }

      this.eventsGateway.emitOperationUpdate(pax.operation_id.toString(), {
        type: 'pax_update',
        pax,
        checked_in_count: operation?.checked_in_count,
      });
    }

    this.eventsGateway.emitAlert({
      type: 'checkin',
      paxId: id,
      paxName: pax.name,
      status: 'checked_in',
    });

    return pax;
  }

  async findAll() {
    return this.paxModel.find().exec();
  }
}
