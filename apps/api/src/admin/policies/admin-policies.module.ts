import { Module } from '@nestjs/common';
import { AdminPoliciesService } from './admin-policies.service';
import { AdminPoliciesController } from './admin-policies.controller';

@Module({
  controllers: [AdminPoliciesController],
  providers: [AdminPoliciesService],
})
export class AdminPoliciesModule {}
