import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminConsentLogsService } from './admin-consent-logs.service';

@Controller('admin/consent-logs')
@UseGuards(AuthGuard('admin-jwt'))
export class AdminConsentLogsController {
  constructor(private service: AdminConsentLogsService) {}

  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.service.findAll(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined);
  }
}
