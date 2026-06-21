import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ReferralsService } from './referrals.service';

@Controller('referrals')
@UseGuards(JwtAuthGuard)
export class ReferralsController {
  constructor(private referralsService: ReferralsService) {}

  @Get('my-code')
  async getCode(@CurrentUser() user: { id: string }) {
    return this.referralsService.getOrCreateCode(user.id);
  }

  @Get('status')
  async getStatus(@CurrentUser() user: { id: string }) {
    return this.referralsService.getStatus(user.id);
  }
}
