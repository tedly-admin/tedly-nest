import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    create table document (
      id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      "name" varchar(255) NOT NULL,
      "type" varchar(255) null,
      created_at  timestamp(6) NOT NULL DEFAULT now(),
      updated_at   timestamp(6) NOT NULL DEFAULT now(),
      created_by_id int4 null,
      updated_by_id int4 null
    );

  `);
}

export async function down(knex: Knex): Promise<void> {}
