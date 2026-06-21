import { Module } from '@nestjs/common';
import { AdminAdminUsersService } from './admin-admin-users.service';
import { AdminAdminUsersController } from './admin-admin-users.controller';

@Module({
  controllers: [AdminAdminUsersController],
  providers: [AdminAdminUsersService],
})
export class AdminAdminUsersModule {}
