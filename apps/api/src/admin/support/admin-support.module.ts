import { Module } from '@nestjs/common';
import { AdminSupportService } from './admin-support.service';
import { AdminSupportController } from './admin-support.controller';

@Module({
  controllers: [AdminSupportController],
  providers: [AdminSupportService],
})
export class AdminSupportModule {}
