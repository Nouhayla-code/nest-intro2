import { Migration } from '@mikro-orm/migrations';

export class Migration20250424141828 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "user" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`,
    );
    this.addSql(
      `alter table "user" alter column "created_at" set default now();`,
    );
    this.addSql(
      `alter table "user" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`,
    );
    this.addSql(
      `alter table "user" alter column "updated_at" set default now();`,
    );
    this.addSql(
      `alter table "user" add constraint "user_email_unique" unique ("email");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_email_unique";`);

    this.addSql(`alter table "user" alter column "created_at" drop default;`);
    this.addSql(
      `alter table "user" alter column "created_at" type varchar(255) using ("created_at"::varchar(255));`,
    );
    this.addSql(`alter table "user" alter column "updated_at" drop default;`);
    this.addSql(
      `alter table "user" alter column "updated_at" type varchar(255) using ("updated_at"::varchar(255));`,
    );
  }
}
