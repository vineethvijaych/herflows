import { Module } from '@nestjs/common';
import { AdminConsentLogsService } from './admin-consent-logs.service';
import { AdminConsentLogsController } from './admin-consent-logs.controller';

@Module({
  controllers: [AdminConsentLogsController],
  providers: [AdminConsentLogsService],
})
export class AdminConsentLogsModule {}
