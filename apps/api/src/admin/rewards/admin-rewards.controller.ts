import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminRewardsService } from './admin-rewards.service';

@Controller('admin/rewards')
@UseGuards(AuthGuard('admin-jwt'))
export class AdminRewardsController {
  constructor(private service: AdminRewardsService) {}

  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.service.findAll(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined);
  }
}
