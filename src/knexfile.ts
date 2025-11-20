import * as dotenv from 'dotenv';
import type { Knex } from 'knex';
import * as path from 'path';

// Load environment variables
dotenv.config();

// Determine if we're in production (compiled code)
// In production, code runs from dist/, in development from src/
const isProduction = process.env.NODE_ENV === 'production';

function getMigrationsDirectory(): string {
  return isProduction
    ? path.join(__dirname, '/database/')
    : path.join(__dirname, '../src/database/');
}

const config: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: getMigrationsDirectory() + 'migrations',
    loadExtensions: isProduction ? ['.js'] : ['.ts'],
  },
  seeds: {
    directory: getMigrationsDirectory() + 'seeds',
  },
};

export default config;
