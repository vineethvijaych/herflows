import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async create(
    @CurrentUser() user: { id: string },
    @Body() data: { subscriptionId?: string; items: { productVariantId: string; quantity: number }[] },
  ) {
    return this.ordersService.create(user.id, data);
  }

  @Get()
  async findAll(@CurrentUser() user: { id: string }) {
    return this.ordersService.findAllByUser(user.id);
  }

  @Get(':id')
  async findById(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.ordersService.findById(user.id, id);
  }

  @Get(':id/tracking')
  async getTracking(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.ordersService.getTracking(user.id, id);
  }
}
