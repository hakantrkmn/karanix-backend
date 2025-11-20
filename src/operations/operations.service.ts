import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Operation, OperationDocument } from './schemas/operation.schema';
import { CreateOperationDto } from './dto/create-operation.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { StartOperationDto } from './dto/start-operation.dto';
@Injectable()
export class OperationsService {
  constructor(
    @InjectModel(Operation.name)
    private operationModel: Model<OperationDocument>,
  ) {}

  async create(operation: CreateOperationDto) {
    const newOperation = new this.operationModel(operation);
    return newOperation.save();
  }
  async findAll(findAllQueryDto: FindAllQueryDto) {
    const query: {
      start_time?: { $gte: Date; $lte: Date };
      status?: string;
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
    operation.status = 'active';
    await operation.save();

    return operation;
  }

  async findByVehicleId(vehicleId: string) {
    return this.operationModel
      .findOne({ vehicle_id: vehicleId, status: 'active' })
      .exec();
  }
}
