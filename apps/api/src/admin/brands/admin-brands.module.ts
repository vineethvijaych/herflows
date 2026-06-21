import { Module } from '@nestjs/common';
import { AdminBrandsService } from './admin-brands.service';
import { AdminBrandsController } from './admin-brands.controller';

@Module({
  controllers: [AdminBrandsController],
  providers: [AdminBrandsService],
})
export class AdminBrandsModule {}
