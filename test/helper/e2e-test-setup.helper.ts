import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { TestContainerHelper } from './test-container.helper';
import { DataSource } from 'typeorm';
import { configureApp } from '../../src/common/utils/app-config.util';
export interface E2ETestSetup {
  app: INestApplication<App>;
  testContainerHelper: TestContainerHelper;
  moduleFixture: TestingModule;
  dataSource: DataSource;
}

/**
 * Sets up the test environment for e2e tests.
 * This includes:
 * - Starting a PostgreSQL test container
 * - Setting up environment variables
 * - Creating and initializing the NestJS application
 * - Configuring validation pipes
 *
 * @returns An object containing the app, testContainerHelper, moduleFixture, and dataSource
 */
export async function setupE2ETest(): Promise<E2ETestSetup> {
  // Start PostgreSQL container using TestContainers
  // This creates an isolated PostgreSQL database for testing (like SpringBootTest)
  const testContainerHelper = new TestContainerHelper();
  await testContainerHelper.startContainer();

  // Get connection configuration from container
  const connectionConfig = testContainerHelper.getConnectionConfig();

  // Set environment variables BEFORE importing any modules
  // This ensures knexfile.ts and DatabaseModule read the correct database configuration
  // IMPORTANT: Set these BEFORE any module imports to prevent knexfile.ts from reading wrong values
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_HOST = connectionConfig.host;
  process.env.DATABASE_PORT = connectionConfig.port.toString();
  process.env.DATABASE_NAME = connectionConfig.database;
  process.env.DATABASE_USERNAME = connectionConfig.user;
  process.env.DATABASE_PASSWORD = connectionConfig.password;

  // Log the connection config to verify it's using the test container
  console.log('Test container database config:', {
    host: connectionConfig.host,
    port: connectionConfig.port,
    database: connectionConfig.database,
    user: connectionConfig.user,
  });

  // Dynamically import AppModule AFTER setting environment variables
  // This prevents knexfile.ts from being evaluated with wrong env vars
  // Use require() to avoid TypeScript import issues
  const { AppModule } = require('../../src/app.module');

  // Create testing module with full application context (like @SpringBootTest)
  // All modules, controllers, services, and dependencies are loaded
  // The existing DatabaseModule and DatabaseService will use the env vars we set above
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  // Create app with validation pipe
  const app = moduleFixture.createNestApplication();
  configureApp(app);

  // Initialize the app (this will connect to the database and run migrations via DatabaseService)
  await app.init();

  // Get DataSource for cleanup
  const dataSource = moduleFixture.get(DataSource);

  return {
    app,
    testContainerHelper,
    moduleFixture,
    dataSource,
  };
}

/**
 * Tears down the test environment for e2e tests.
 * This includes:
 * - Closing the NestJS application
 * - Closing the module fixture
 * - Destroying the DataSource connection
 * - Stopping and removing the test container
 *
 * @param setup The test setup object returned from setupE2ETest
 */
export async function teardownE2ETest(setup: E2ETestSetup): Promise<void> {
  console.log('AfterAll: Starting cleanup...');
  try {
    // Close app first
    if (setup.app) {
      await setup.app.close();
    }

    // Close module fixture (this should trigger onModuleDestroy hooks)
    if (setup.moduleFixture) {
      await setup.moduleFixture.close();
    }

    // Explicitly close DataSource if it's still initialized
    if (setup.dataSource && setup.dataSource.isInitialized) {
      await setup.dataSource.destroy();
    }

    // Finally, stop and remove the container
    // This must be done last after all connections are closed
    await setup.testContainerHelper.stopContainer();
    console.log('AfterAll: Cleanup completed successfully');
  } catch (error) {
    console.error('AfterAll: Error during cleanup', error);
    // Still try to stop container even if there's an error
    try {
      await setup.testContainerHelper.stopContainer();
    } catch (stopError) {
      console.error('AfterAll: Error stopping container', stopError);
    }
    throw error;
  }
}
