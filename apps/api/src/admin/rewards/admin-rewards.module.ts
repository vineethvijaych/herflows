import { Module } from '@nestjs/common';
import { AdminRewardsService } from './admin-rewards.service';
import { AdminRewardsController } from './admin-rewards.controller';

@Module({
  controllers: [AdminRewardsController],
  providers: [AdminRewardsService],
})
export class AdminRewardsModule {}
