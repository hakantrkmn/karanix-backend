import { Controller, Post, Body, Param, UseGuards, Get } from '@nestjs/common';
import { PaxService } from './pax.service';
import { CheckInDto } from './dto/check-in.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pax')
export class PaxController {
  constructor(private readonly paxService: PaxService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/checkin')
  checkIn(@Param('id') id: string, @Body() checkInDto: CheckInDto) {
    return this.paxService.checkIn(id, checkInDto);
  }

  @Get()
  findAll() {
    return this.paxService.findAll();
  }
}
