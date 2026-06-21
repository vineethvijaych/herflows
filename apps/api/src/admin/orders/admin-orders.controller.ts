import { Controller, Get, Param, Query, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminOrdersService } from './admin-orders.service';

@Controller('admin/orders')
@UseGuards(AuthGuard('admin-jwt'))
export class AdminOrdersController {
  constructor(private adminOrdersService: AdminOrdersService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminOrdersService.findAll(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined, search, status);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.adminOrdersService.findById(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string, @Body('note') note?: string) {
    return this.adminOrdersService.updateStatus(id, status, note);
  }
}
