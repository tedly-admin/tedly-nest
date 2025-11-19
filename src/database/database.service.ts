import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import knex, { Knex } from 'knex';
import config from '../../knexfile';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  public readonly knex: Knex;
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {
    this.knex = knex(config);
  }

  async onModuleInit() {
    // Only run migrations automatically if RUN_MIGRATIONS_ON_START is true
    // Otherwise, run migrations manually using: npm run migrate:latest
    const shouldRunMigrations = process.env.RUN_MIGRATIONS_ON_START === 'true';

    if (shouldRunMigrations) {
      try {
        this.logger.log('Running database migrations...');
        await this.knex.migrate.latest();
        this.logger.log('Database migrations completed successfully');
      } catch (error) {
        this.logger.error('Failed to run database migrations', error);
        throw error;
      }
    } else {
      this.logger.log(
        'Skipping automatic migrations. Run manually with: npm run migrate:latest',
      );
      this.logger.log(
        'To enable automatic migrations, set RUN_MIGRATIONS_ON_START=true',
      );
    }
  }

  async onModuleDestroy() {
    if (this.knex) {
      this.logger.log('Closing database connections...');
      await this.knex.destroy();
      this.logger.log('Database connections closed');
    }
  }
}
