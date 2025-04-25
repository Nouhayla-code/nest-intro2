import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document } from './entities/document.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
  imports: [MikroOrmModule.forFeature([Document]), OpenaiModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
