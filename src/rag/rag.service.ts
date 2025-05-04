import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { CohereClient } from 'cohere-ai';
import { DocumentChunk } from 'src/document/entities/document-chunk.entity';
import { Vector } from 'src/document/entities/document.entity';

export type CohereRerankResponse = {
  index: number;
  relevanceScore: number;
  text: string;
};

@Injectable()
export class RagService {
  private openai: OpenAI;
  private cohereClient: CohereClient;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.cohereClient = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });
  }

  async generateEmbedding(text: string): Promise<Vector> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });
    console.log(response);
    return response.data[0].embedding;
  }

  async rerankWithCohere(
    query: string,
    documentChunks: DocumentChunk[],
    topN = 5,
  ): Promise<CohereRerankResponse[]> {
    const docsForCohere = documentChunks.map((chunk) => chunk.content);

    const rerankedResults = await this.cohereClient.rerank({
      query,
      documents: docsForCohere,
      topN: topN,
      model: 'rerank-v3.5',
    });

    const sortedChunks: CohereRerankResponse[] = rerankedResults.results.map(
      (result) => ({
        text: documentChunks[result.index].content,
        relevanceScore: result.relevanceScore,
        index: result.index,
      }),
    );

    return sortedChunks;
  }

  async generateResponse(
    prompt: string,
    relevantChunks: CohereRerankResponse[],
  ): Promise<string> {
    const cleanContextText = relevantChunks
      .map((doc) => doc.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim())
      .join('\n\n');

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant. Use the following context to answer the user's question. 
                  If the context doesn't contain relevant information, acknowledge that and provide a 
                  general response based on your knowledge. Respond in the same language as the user prompt.
                  
                  Context:
                  ${cleanContextText}`,
        },
        { role: 'user', content: prompt },
      ],
    });

    return response.choices[0].message.content ?? 'Intet svar fra OpenAI.';
  }
}
