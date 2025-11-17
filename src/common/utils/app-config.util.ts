import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

/**
 * Configures global pipes and filters for the NestJS application.
 * This includes:
 * - ValidationPipe with whitelist, forbidNonWhitelisted, and transform options
 * - HttpExceptionFilter for global exception handling
 *
 * @param app The NestJS application instance to configure
 */
export function configureApp(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
}

