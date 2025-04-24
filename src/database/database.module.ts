import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import MIKROORM_CONFIG from './mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(MIKROORM_CONFIG)],
  controllers: [],
  providers: [],
  exports: [],
})
export class DatabaseModule {}
