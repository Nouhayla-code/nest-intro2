import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { DocumentModule } from './document/document.module';
import { OpenaiService } from './openai/openai.service';

@Module({
  imports: [UsersModule, DatabaseModule, DocumentModule],
  controllers: [AppController],
  providers: [AppService, OpenaiService],
})
export class AppModule {}
