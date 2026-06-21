import { Controller, Get, Param } from '@nestjs/common';
import { EducationService } from './education.service';

@Controller('education')
export class EducationController {
  constructor(private educationService: EducationService) {}

  @Get('articles')
  async findAll() {
    return this.educationService.findAll();
  }

  @Get('articles/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.educationService.findBySlug(slug);
  }
}
