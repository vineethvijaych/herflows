import { Module } from '@nestjs/common';
import { AdminCouponsService } from './admin-coupons.service';
import { AdminCouponsController } from './admin-coupons.controller';

@Module({
  controllers: [AdminCouponsController],
  providers: [AdminCouponsService],
})
export class AdminCouponsModule {}
