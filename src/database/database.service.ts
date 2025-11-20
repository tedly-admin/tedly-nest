import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import knex, { Knex } from 'knex';
import config from '../knexfile';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  public readonly knex: Knex;
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {
    this.knex = knex(config);
  }

  async onModuleInit() {

    try {
      this.logger.log('Running database migrations...');
      await this.knex.migrate.latest();
      this.logger.log('Database migrations completed successfully');
    } catch (error) {
      this.logger.error('Failed to run database migrations', error);
      throw error;
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
