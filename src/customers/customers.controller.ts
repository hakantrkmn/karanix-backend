import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { AddLocationToCustomerDto } from './dto/add-location.dto';
import { FindOneCustomerDto } from './dto/find-one.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param() findOneDto: FindOneCustomerDto) {
    return this.customersService.findOne(findOneDto.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/locations/:locationId')
  addLocation(@Param() addLocationDto: AddLocationToCustomerDto) {
    return this.customersService.addLocationToCustomer(addLocationDto);
  }
}
