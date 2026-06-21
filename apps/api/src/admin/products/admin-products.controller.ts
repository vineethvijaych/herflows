import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminProductsService } from './admin-products.service';

@Controller('admin/products')
@UseGuards(AuthGuard('admin-jwt'))
export class AdminProductsController {
  constructor(private adminProductsService: AdminProductsService) {}

  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string) {
    return this.adminProductsService.findAll(page ? parseInt(page) : undefined, limit ? parseInt(limit) : undefined, search);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.adminProductsService.findById(id);
  }

  @Post()
  async create(@Body() data: { name: string; description?: string; brandId: string; categoryId: string }) {
    return this.adminProductsService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.adminProductsService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.adminProductsService.delete(id);
  }

  @Post(':id/variants')
  async createVariant(@Param('id') id: string, @Body() data: { sku: string; attributes: any; price: number; stockQty?: number }) {
    return this.adminProductsService.createVariant(id, data);
  }

  @Patch('variants/:variantId')
  async updateVariant(@Param('variantId') variantId: string, @Body() data: any) {
    return this.adminProductsService.updateVariant(variantId, data);
  }

  @Delete('variants/:variantId')
  async deleteVariant(@Param('variantId') variantId: string) {
    return this.adminProductsService.deleteVariant(variantId);
  }

  @Post(':id/images')
  async addImage(@Param('id') id: string, @Body() data: { url: string }) {
    return this.adminProductsService.addImage(id, data.url);
  }

  @Delete(':id/images/:imageId')
  async removeImage(@Param('imageId') imageId: string) {
    return this.adminProductsService.removeImage(imageId);
  }
}
