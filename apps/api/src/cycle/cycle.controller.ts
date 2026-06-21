import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CycleService } from './cycle.service';

@Controller('cycle')
@UseGuards(JwtAuthGuard)
export class CycleController {
  constructor(private cycleService: CycleService) {}

  @Post('entries')
  async createEntry(
    @CurrentUser() user: { id: string },
    @Body() data: { date: string; flowLevel?: string; mood?: string; symptoms?: string[]; notes?: string },
  ) {
    return this.cycleService.createEntry(user.id, data);
  }

  @Get('entries')
  async getEntries(@CurrentUser() user: { id: string }) {
    return this.cycleService.getEntries(user.id);
  }

  @Get('estimate')
  async getEstimate(@CurrentUser() user: { id: string }) {
    return this.cycleService.getEstimate(user.id);
  }

  @Delete('entries/:id')
  async deleteEntry(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ) {
    return this.cycleService.deleteEntry(user.id, id);
  }
}
