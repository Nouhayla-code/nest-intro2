import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}
  @Get()
  async findAll() {
    return await this.documentService.findAll();
  }

  @Get('to-vector')
  async toVector() {
    const text = 'What is the capital of France?';
    const embedding = await this.documentService.getEmbedding(text);
    return embedding;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('controller', file);
    await this.documentService.readFile(file);
  }
}
