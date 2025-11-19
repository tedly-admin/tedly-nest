/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
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
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {};

