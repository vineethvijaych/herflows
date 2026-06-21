import { Controller, Get, Param, Query, Patch, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminSupportService } from './admin-support.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('admin/support')
@UseGuards(AuthGuard('admin-jwt'))
export class AdminSupportController {
  constructor(private service: AdminSupportService) {}

  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('status') status?: string) {
    return this.service.findAll(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined, status);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.service.updateStatus(id, status);
  }

  @Post(':id/reply')
  async reply(@Param('id') id: string, @CurrentUser() user: { id: string }, @Body('message') message: string) {
    return this.service.reply(id, user.id, message);
  }
}
