import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Operation, OperationDocument } from './schemas/operation.schema';
import { Pax, PaxDocument } from '../pax/schemas/pax.schema';
import { EventsGateway } from '../events/events.gateway';
import { CreateOperationDto } from './dto/create-operation.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { StartOperationDto } from './dto/start-operation.dto';
import { CreatePaxDto } from '../pax/dto/create-pax.dto';
import { OperationStatus } from './types/operation.types';

@Injectable()
export class OperationsService {
  constructor(
    @InjectModel(Operation.name)
    private operationModel: Model<OperationDocument>,
    @InjectModel(Pax.name)
    private paxModel: Model<PaxDocument>,
    private eventsGateway: EventsGateway,
  ) {}

  async create(createOperationDto: CreateOperationDto) {
    const createdOperation = new this.operationModel(createOperationDto);
    return createdOperation.save();
  }

  async findAll(findAllQueryDto: FindAllQueryDto) {
    const query: {
      start_time?: { $gte: Date; $lte: Date };
      status?: OperationStatus;
    } = {};
    if (findAllQueryDto.date) {
      const start = new Date(findAllQueryDto.date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(findAllQueryDto.date);
      end.setHours(23, 59, 59, 999);
      query.start_time = { $gte: start, $lte: end };
    }
    if (findAllQueryDto.status) {
      query.status = findAllQueryDto.status;
    }
    return this.operationModel.find(query).populate('pax').exec();
  }

  async findOne(id: string) {
    const operation = await this.operationModel
      .findById(id)
      .populate('pax')
      .exec();
    if (!operation) {
      throw new NotFoundException('Operation not found');
    }
    return operation;
  }

  async start(startOperationDto: StartOperationDto) {
    const operation = await this.operationModel.findById(startOperationDto.id);
    if (!operation) {
      throw new NotFoundException('Operation not found');
    }
    operation.status = OperationStatus.ACTIVE;
    await operation.save();

    this.eventsGateway.emitOperationUpdate(startOperationDto.id, {
      type: 'status_change',
      status: OperationStatus.ACTIVE,
    });
    return operation;
  }

  async findByVehicleId(vehicleId: string) {
    return this.operationModel
      .findOne({ vehicle_id: vehicleId, status: 'active' })
      .exec();
  }

  async addPaxToOperation(operationId: string, createPaxDto: CreatePaxDto) {
    const operation = await this.operationModel.findById(operationId);
    if (!operation) {
      throw new NotFoundException('Operation not found');
    }

    const pax = new this.paxModel({
      ...createPaxDto,
      operation_id: operationId,
    });
    const savedPax = await pax.save();

    operation.pax.push(savedPax._id.toString());
    operation.total_pax = (operation.total_pax || 0) + 1;
    await operation.save();

    this.eventsGateway.emitOperationUpdate(operationId, {
      type: 'pax_added',
      pax: savedPax,
      total_pax: operation.total_pax,
    });

    return savedPax;
  }
}
