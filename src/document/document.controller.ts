import {
  Body,
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

  @Get('similarity')
  async getSimilarity(@Body() body: { prompt: string }) {
    const similarDocs =
      await this.documentService.retrieveSimilarDocumentChunks(body.prompt);
    return this.documentService.rerankWithCohere(body.prompt, similarDocs);
  }

  @Get('to-vector')
  async toVector() {
    const text = 'What is the capital of France?';
    const embedding = await this.documentService.generateEmbedding(text);
    return embedding;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async ugenerateAnsweradFile(@UploadedFile() file: Express.Multer.File) {
    console.log('controller', file);
    await this.documentService.processPdf(file);
  }

  // @Post('ask')
  // async ask(@Body() body: { prompt: string }) {
  //   const similarDocs =
  //     await this.documentService.retrieveSimilarDocumentChunks(body.prompt);
  //   const rerankedResults = await this.documentService.rerankWithCohere(
  //     body.prompt,
  //     similarDocs,
  //   );
  //   return this.documentService.generateAnswer(body.prompt, rerankedResults);
  // }
}
