import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

export class TestContainerHelper {
  private container: StartedPostgreSqlContainer | null = null;

  async startContainer(): Promise<StartedPostgreSqlContainer> {
    this.container = await new PostgreSqlContainer('postgres:15-alpine')
      .withDatabase('testdb')
      .withUsername('testuser')
      .withPassword('testpassword')
      .start();

    return this.container;
  }

  async stopContainer(): Promise<void> {
    if (this.container) {
      console.log('Stopping container...');
      await this.container.stop();

      console.log('Stopping container... done');
      this.container = null;
    }
  }

  getConnectionConfig() {
    if (!this.container) {
      throw new Error('Container is not started. Call startContainer() first.');
    }

    return {
      host: this.container.getHost(),
      port: this.container.getPort(),
      database: this.container.getDatabase(),
      user: this.container.getUsername(),
      password: this.container.getPassword(),
    };
  }
}
