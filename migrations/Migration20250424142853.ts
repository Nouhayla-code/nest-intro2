import { Migration } from '@mikro-orm/migrations';

export class Migration20250424142853 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`CREATE EXTENSION IF NOT EXISTS vector;`);

    this.addSql(
      `alter table "document" alter column "embedding" type vector using ("embedding"::vector);`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "document" alter column "embedding" type varchar(255) using ("embedding"::varchar(255));`,
    );
    this.addSql(`DROP EXTENSION IF NOT EXISTS vector;`);
  }
}
