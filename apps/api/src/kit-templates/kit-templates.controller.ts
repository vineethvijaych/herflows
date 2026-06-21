import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { KitTemplatesService } from './kit-templates.service';

@Controller('kit-templates')
@UseGuards(JwtAuthGuard)
export class KitTemplatesController {
  constructor(private kitTemplatesService: KitTemplatesService) {}

  @Post()
  async create(
    @CurrentUser() user: { id: string },
    @Body() data: { name: string; items: { productVariantId: string; quantity: number }[] },
  ) {
    return this.kitTemplatesService.create(user.id, data);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() data: { name?: string; items?: { productVariantId: string; quantity: number }[] },
  ) {
    return this.kitTemplatesService.update(id, user.id, data);
  }

  @Get()
  async findAll(@CurrentUser() user: { id: string }) {
    return this.kitTemplatesService.findAllByUser(user.id);
  }

  @Post(':id/set-active')
  async setActive(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
  ) {
    return this.kitTemplatesService.setActive(user.id, id);
  }
}
