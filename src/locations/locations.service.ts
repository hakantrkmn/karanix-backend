import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateLocationDto } from './dto/create-location.dto';
import { Model } from 'mongoose';
import { Location, LocationDocument } from './schemas/location.schema';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
  ) {}

  async create(location: CreateLocationDto): Promise<Location> {
    const newLocation = new this.locationModel(location);
    return newLocation.save();
  }

  async findAll(): Promise<Location[]> {
    return this.locationModel.find();
  }
}
