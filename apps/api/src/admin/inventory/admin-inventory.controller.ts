import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminInventoryService } from './admin-inventory.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('admin/inventory')
@UseGuards(AuthGuard('admin-jwt'))
export class AdminInventoryController {
  constructor(private service: AdminInventoryService) {}

  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('lowStock') lowStock?: string) {
    return this.service.findAll(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined, lowStock);
  }

  @Post('adjust')
  async adjustStock(
    @Body() data: { variantId: string; delta: number; reason: string },
    @CurrentUser() user: { id: string },
  ) {
    return this.service.adjustStock(data.variantId, data.delta, data.reason, user.id);
  }
}
