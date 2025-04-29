/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { Document } from './entities/document.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Vector } from './entities/document.entity';
import { RagService } from 'src/rag/rag.service';
import * as pdfParse from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { DocumentChunk } from './entities/document-chunk.entity';
import { cosineDistance } from 'pgvector/mikro-orm';

type PdfData = {
  text: string;
  numPages: number;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  producer?: string;
  creationDate?: string;
  modDateDate?: string;
  creator?: string;
};

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: EntityRepository<Document>,
    @InjectRepository(DocumentChunk)
    private readonly chunkRepository: EntityRepository<DocumentChunk>,
    private readonly ragService: RagService,
    private readonly em: EntityManager,
  ) {}

  findAll() {
    return this.documentRepository.findAll();
  }

  async generateEmbedding(text: string): Promise<Vector> {
    const response: Vector = await this.ragService.generateEmbedding(text);
    return response;
  }

  async readPdf(file: Express.Multer.File): Promise<PdfData> {
    const pdfData = await pdfParse(file.buffer);

    const pdf: PdfData = {
      text: pdfData.text,
      numPages: pdfData.numpages,
      title: pdfData.info.Title,
      author: pdfData.info.Author,
      subject: pdfData.info.Subject,
      keywords: pdfData.info.Keywords,
      producer: pdfData.info.Producer,
      creationDate: pdfData.info.CreationDate,
      modDateDate: pdfData.info.ModDate,
      creator: pdfData.info.Creator,
    };

    console.log('service', pdf);
    return pdf;
  }

  async processPdf(file: Express.Multer.File): Promise<void> {
    const pdfData = await this.readPdf(file);
    const text = pdfData.text;

    const saveDocument = await this.saveDocument(pdfData);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ['\n\n', '\n', '. ', ' ', ''],
    });

    const chunks = await splitter.splitText(text);

    for (const chunk of chunks) {
      const embedding = await this.generateEmbedding(chunk);
      const documentChunk = new DocumentChunk();
      documentChunk.content = chunk;
      documentChunk.embedding = embedding;
      documentChunk.document = saveDocument;
      this.chunkRepository.getEntityManager().persist(documentChunk);
    }
    await this.documentRepository.getEntityManager().flush();
  }
  async saveDocument(pdf: PdfData): Promise<Document> {
    const document = this.documentRepository.create(pdf);
    await this.documentRepository.getEntityManager().persistAndFlush(document);
    return document;
  }

  async findSimilar(
    queryEmbedding: Vector,
    limit = 10,
  ): Promise<DocumentChunk[]> {
    const documentChunk = await this.em
      .createQueryBuilder(DocumentChunk)
      .orderBy({
        [cosineDistance('embedding', queryEmbedding, this.em)]: 'ASC',
      })
      .limit(limit)
      .getResult();

    return documentChunk;
  }

  async retrieveSimilarDocumentChunks(
    query: string,
    limit = 20,
  ): Promise<DocumentChunk[]> {
    const queryEmbedding = await this.generateEmbedding(query);
    return this.findSimilar(queryEmbedding, limit);
  }

  async rerankWithCohere(
    query: string,
    documentChunks: DocumentChunk[],
    topN = 5,
  ) {
    return await this.ragService.rerankWithCohere(query, documentChunks, topN);
  }
}
