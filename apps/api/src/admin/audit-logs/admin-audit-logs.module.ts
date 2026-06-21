import { Module } from '@nestjs/common';
import { AdminAuditLogsService } from './admin-audit-logs.service';
import { AdminAuditLogsController } from './admin-audit-logs.controller';

@Module({
  controllers: [AdminAuditLogsController],
  providers: [AdminAuditLogsService],
})
export class AdminAuditLogsModule {}
