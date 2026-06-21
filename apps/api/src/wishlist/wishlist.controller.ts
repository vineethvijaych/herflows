import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Post()
  async add(
    @CurrentUser() user: { id: string },
    @Body('productVariantId') productVariantId: string,
  ) {
    return this.wishlistService.add(user.id, productVariantId);
  }

  @Get()
  async findAll(@CurrentUser() user: { id: string }) {
    return this.wishlistService.findAll(user.id);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.wishlistService.remove(user.id, id);
  }
}
