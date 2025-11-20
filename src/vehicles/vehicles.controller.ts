import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateHeartbeatDto } from './dto/create-heartbeat.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post(':id/heartbeat')
  createHeartbeat(
    @Param('id') id: string,
    @Body() createHeartbeatDto: CreateHeartbeatDto,
  ) {
    return this.vehiclesService.createHeartbeat(id, createHeartbeatDto);
  }

  @Get(':id/history')
  getHistory(@Param('id') id: string) {
    return this.vehiclesService.getHistory(id);
  }
}
