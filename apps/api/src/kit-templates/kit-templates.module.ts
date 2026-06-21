import { Module } from '@nestjs/common';
import { KitTemplatesService } from './kit-templates.service';
import { KitTemplatesController } from './kit-templates.controller';

@Module({
  controllers: [KitTemplatesController],
  providers: [KitTemplatesService],
})
export class KitTemplatesModule {}
