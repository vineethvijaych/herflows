import { Controller, Post, Get, Param, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ConsentsService } from './consents.service';

@Controller()
export class ConsentsController {
  constructor(private consentsService: ConsentsService) {}

  @Post('consents')
  @UseGuards(JwtAuthGuard)
  async recordConsent(
    @CurrentUser() user: { id: string },
    @Body('policyType') policyType: string,
    @Req() req: Request,
  ) {
    return this.consentsService.recordConsent(
      user.id,
      policyType,
      req.ip || req.socket.remoteAddress || '',
      req.headers['user-agent'] || '',
    );
  }

  @Get('policies/:type/latest')
  async getLatestPolicy(@Param('type') type: string) {
    return this.consentsService.getLatestPolicy(type);
  }
}
