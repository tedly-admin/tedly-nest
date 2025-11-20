import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    create table book (
      id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      title varchar(255) null,
      description text null,
      "name" varchar(255) null,
      created_at timestamp(6) null,
      updated_at timestamp(6) null
    )
  `);
}

export async function down(knex: Knex): Promise<void> {}
