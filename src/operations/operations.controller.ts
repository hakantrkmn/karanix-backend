import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OperationsService } from './operations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOperationDto } from './dto/create-operation.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { StartOperationDto } from './dto/start-operation.dto';
import { CreatePaxDto } from '../pax/dto/create-pax.dto';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOperationDto: CreateOperationDto) {
    return this.operationsService.create(createOperationDto);
  }

  @Get()
  findAll(@Query() findAllQueryDto: FindAllQueryDto) {
    return this.operationsService.findAll(findAllQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/start')
  start(@Param() startOperationDto: StartOperationDto) {
    return this.operationsService.start(startOperationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/pax')
  addPaxToOperation(
    @Param('id') operationId: string,
    @Body() createPaxDto: CreatePaxDto,
  ) {
    return this.operationsService.addPaxToOperation(operationId, createPaxDto);
  }
}
