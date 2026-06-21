import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ReviewsService } from './reviews.service';

@Controller()
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: { id: string },
    @Body() data: { productId: string; orderId: string; rating: number; text: string; photos?: string[] },
  ) {
    return this.reviewsService.create(user.id, data);
  }

  @Get('products/:id/reviews')
  async findByProduct(@Param('id') id: string) {
    return this.reviewsService.findByProduct(id);
  }
}
