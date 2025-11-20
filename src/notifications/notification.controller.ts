import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MarkAsReadDto } from './dto/mark-as-read.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/read')
  markAsRead(@Param() markAsReadDto: MarkAsReadDto) {
    return this.notificationsService.markAsRead(markAsReadDto);
  }
}
