import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminPoliciesService } from './admin-policies.service';

@Controller('admin/policies')
@UseGuards(AuthGuard('admin-jwt'))
export class AdminPoliciesController {
  constructor(private service: AdminPoliciesService) {}

  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.service.findAll(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  async create(@Body() data: { type: string; version: number; content: string }) {
    return this.service.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: { content?: string }) {
    return this.service.update(id, data);
  }
}
