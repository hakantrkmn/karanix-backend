import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { AddLocationToCustomerDto } from './dto/add-location.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const createdCustomer = new this.customerModel(createCustomerDto);
    return createdCustomer.save();
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().populate('locations').exec();
  }

  async findOne(id: string): Promise<Customer | null> {
    return this.customerModel.findById(id).populate('locations').exec();
  }

  async addLocationToCustomer(
    addLocationDto: AddLocationToCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customerModel.findById(addLocationDto.id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (!customer.locations.includes(addLocationDto.locationId)) {
      customer.locations.push(addLocationDto.locationId);
      await customer.save();
    }

    const populated = await customer.populate('locations');
    return populated as Customer;
  }
}
