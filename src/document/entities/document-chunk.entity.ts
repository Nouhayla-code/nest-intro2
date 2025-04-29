import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { VectorType } from 'pgvector/mikro-orm';
import { Document } from './document.entity';

export type Vector = number[];

@Entity()
export class DocumentChunk {
  @PrimaryKey()
  uuid = v4();

  @Property({ type: 'text' })
  content: string;

  @Property({ type: VectorType })
  embedding: Vector;

  @ManyToOne(() => Document)
  document: Document;

  @Property({ defaultRaw: 'now()' })
  createdAt?: Date;

  @Property({ onUpdate: () => 'now()', defaultRaw: 'now()' })
  updatedAt?: Date;
}
