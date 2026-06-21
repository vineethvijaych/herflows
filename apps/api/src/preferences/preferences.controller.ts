import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PreferencesService } from './preferences.service';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class PreferencesController {
  constructor(private preferencesService: PreferencesService) {}

  @Post('preferences')
  async save(
    @CurrentUser() user: { id: string },
    @Body() data: any,
  ) {
    return this.preferencesService.save(user.id, data);
  }

  @Get('preferences')
  async get(@CurrentUser() user: { id: string }) {
    return this.preferencesService.get(user.id);
  }
}
