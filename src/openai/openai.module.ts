import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Module({
  imports: [],
  controllers: [],
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
