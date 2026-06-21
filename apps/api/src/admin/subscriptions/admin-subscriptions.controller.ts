import { Controller, Get, Param, Query, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminSubscriptionsService } from './admin-subscriptions.service';

@Controller('admin/subscriptions')
@UseGuards(AuthGuard('admin-jwt'))
export class AdminSubscriptionsController {
  constructor(private service: AdminSubscriptionsService) {}

  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string, @Query('status') status?: string) {
    return this.service.findAll(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined, search, status);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.service.updateStatus(id, status);
  }
}
