import { Controller, Get, Param, Query, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminReviewsService } from './admin-reviews.service';

@Controller('admin/reviews')
@UseGuards(AuthGuard('admin-jwt'))
export class AdminReviewsController {
  constructor(private service: AdminReviewsService) {}

  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('status') status?: string) {
    return this.service.findAll(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined, status);
  }

  @Patch(':id/moderate')
  async moderate(@Param('id') id: string, @Body('status') status: 'approved' | 'rejected') {
    return this.service.moderate(id, status);
  }
}
