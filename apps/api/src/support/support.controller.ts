import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SupportService } from './support.service';

@Controller('support')
@UseGuards(JwtAuthGuard)
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Post('tickets')
  async createTicket(
    @CurrentUser() user: { id: string },
    @Body() data: { subject: string; message: string },
  ) {
    return this.supportService.createTicket(user.id, data);
  }

  @Get('tickets')
  async getTickets(@CurrentUser() user: { id: string }) {
    return this.supportService.findByUser(user.id);
  }
}
