import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminRolesService } from './admin-roles.service';

@Controller('admin/roles')
@UseGuards(AuthGuard('admin-jwt'))
export class AdminRolesController {
  constructor(private service: AdminRolesService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  async create(@Body() data: { name: string }) {
    return this.service.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: { name?: string }) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Post(':id/permissions')
  async setPermission(@Param('id') id: string, @Body() data: { module: string; action: string; grant: boolean }) {
    return this.service.setPermission(id, data.module, data.action, data.grant);
  }
}
