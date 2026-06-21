import { Controller, Post, Body, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminAuthService } from './admin-auth.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body('email') email: string, @Body('password') password: string) {
    return this.adminAuthService.login(email, password);
  }

  @Get('profile')
  @UseGuards(AuthGuard('admin-jwt'))
  async getProfile(@CurrentUser() user: { id: string }) {
    return this.adminAuthService.getProfile(user.id);
  }
}
