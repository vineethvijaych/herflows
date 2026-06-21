import { Module } from '@nestjs/common';
import { AdminEducationService } from './admin-education.service';
import { AdminEducationController } from './admin-education.controller';

@Module({
  controllers: [AdminEducationController],
  providers: [AdminEducationService],
})
export class AdminEducationModule {}
