/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  return knex.raw(`
    create table category (
      id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      "name" varchar(255) not null,
      entity varchar(255),
      created_at timestamp(6) NOT NULL DEFAULT now(),
      updated_at timestamp(6) NOT NULL DEFAULT now()
    )
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {};
