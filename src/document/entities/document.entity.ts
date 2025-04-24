/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { VectorType } from 'pgvector/mikro-orm';

export type Vector = number[];

@Entity()
export class Document {
  @PrimaryKey()
  uuid = v4();

  @Property({ type: 'text' })
  content: string;

  @Property({ type: VectorType })
  embedding: Vector;

  @Property({ defaultRaw: 'now()' })
  createdAt?: Date;

  @Property({ onUpdate: () => 'now()', defaultRaw: 'now()' })
  updatedAt?: Date;
}
