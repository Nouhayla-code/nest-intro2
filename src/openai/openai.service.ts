import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { Vector } from '../document/entities/document.entity';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getEmbedding(text: string): Promise<Vector> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
      encoding_format: 'float',
    });
    console.log(response);
    return response.data[0].embedding;
  }
}
