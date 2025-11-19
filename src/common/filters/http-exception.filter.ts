import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Get the original status code
    const originalStatus = exception.getStatus();

    // Ensure NotFoundException always returns 404, regardless of original status
    const finalStatus =
      exception instanceof NotFoundException
        ? HttpStatus.NOT_FOUND
        : originalStatus;

    // Log the exception for debugging (optional, remove in production if needed)
    if (exception instanceof NotFoundException) {
      this.logger.debug(
        `NotFoundException caught: ${exception.message} - Setting status to 404`,
      );
    }

    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || exception.message;

    response.status(finalStatus).json({
      statusCode: finalStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: Array.isArray(message) ? message : [message],
    });
  }
}
