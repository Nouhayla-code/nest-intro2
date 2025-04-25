/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { Document } from './entities/document.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Vector } from './entities/document.entity';
import { OpenaiService } from 'src/openai/openai.service';
import * as pdfParse from 'pdf-parse';

type PdfData = {
  text: string;
  numpages: number;
};

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: EntityRepository<Document>,
    private readonly openaiService: OpenaiService, // Inject the OpenAI service
  ) {}

  findAll() {
    return this.documentRepository.findAll();
  }

  async getEmbedding(text: string): Promise<Vector> {
    const response = await this.openaiService.getEmbedding(text);
    return response;
  }

  async readFile(file: Express.Multer.File): Promise<PdfData> {
    const pdfData = await pdfParse(file.buffer);

    const pdf: PdfData = {
      text: pdfData.text,
      numpages: pdfData.numpages,
    };

    console.log('service', pdfData);
    return pdf;
  }

  async saveDocument(content: string, embedding: Vector): Promise<Document> {
    const doc = this.documentRepository.create({
      content,
      embedding,
    });

    await this.documentRepository.getEntityManager().persistAndFlush(doc);
    return doc;
  }
}
