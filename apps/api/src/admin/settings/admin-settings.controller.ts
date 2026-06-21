import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminSettingsService } from './admin-settings.service';

@Controller('admin/settings')
@UseGuards(AuthGuard('admin-jwt'))
export class AdminSettingsController {
  constructor(private service: AdminSettingsService) {}

  @Get()
  async getSettings() {
    return this.service.getSettings();
  }

  @Patch()
  async updateSettings(@Body() data: any) {
    return this.service.updateSettings(data);
  }
}
