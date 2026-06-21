import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post()
  async create(
    @CurrentUser() user: { id: string },
    @Body() data: { planType: string; kitTemplateId: string },
  ) {
    return this.subscriptionsService.create(user.id, data);
  }

  @Get()
  async findAll(@CurrentUser() user: { id: string }) {
    return this.subscriptionsService.findByUser(user.id);
  }

  @Patch(':id/pause')
  async pause(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.subscriptionsService.pause(user.id, id);
  }

  @Patch(':id/resume')
  async resume(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.subscriptionsService.resume(user.id, id);
  }

  @Patch(':id/skip-next')
  async skipNext(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.subscriptionsService.skipNext(user.id, id);
  }

  @Post(':id/renew')
  async renew(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.subscriptionsService.resume(user.id, id);
  }

  @Patch(':id/edit-upcoming-kit')
  async editUpcomingKit(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body('kitTemplateId') kitTemplateId: string,
  ) {
    return this.subscriptionsService.editUpcomingKit(user.id, id, kitTemplateId);
  }
}
