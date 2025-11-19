/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  return knex.raw(`
    create table document (
      id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      "name" varchar(255) NOT NULL,
      "type" varchar(255) null,
      created_at  timestamp(6) NOT NULL DEFAULT now(),
      updated_at   timestamp(6) NOT NULL DEFAULT now()
    );
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {};
