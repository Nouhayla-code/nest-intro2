import { Injectable } from '@nestjs/common';
import { Document } from './entities/document.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Vector } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: EntityRepository<Document>,
  ) {}

  async saveDocument(content: string, embedding: Vector): Promise<Document> {
    const doc = this.documentRepository.create({
      content,
      embedding,
    });

    await this.documentRepository.getEntityManager().persistAndFlush(doc);
    return doc;
  }
}
