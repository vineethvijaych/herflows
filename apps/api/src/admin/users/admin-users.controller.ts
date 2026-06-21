import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminUsersService } from './admin-users.service';

@Controller('admin/users')
@UseGuards(AuthGuard('admin-jwt'))
export class AdminUsersController {
  constructor(private adminUsersService: AdminUsersService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.adminUsersService.findAll(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined, search);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.adminUsersService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: { email?: string; phone?: string; status?: string }) {
    return this.adminUsersService.update(id, data);
  }
}
