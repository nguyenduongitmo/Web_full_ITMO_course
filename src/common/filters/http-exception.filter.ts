import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch() // Bắt tất cả các ngoại lệ
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: any = null;

        // xđ status và message, phân loại exception

    // 1. HttpException (NestJS built-in)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'object') {
        message = (errorResponse as any).message || exception.message;
        errors = (errorResponse as any).errors || null;
      } else {
        message = errorResponse || exception.message;
      }
    }
    // 2. BadRequestException (Validation failed)
    else if (exception instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST;
      const response = exception.getResponse() as any;
      message = response.message || 'Validation failed';
      errors = Array.isArray(response.message) ? response.message : [response.message];
    }
    // 3. NotFoundException
    else if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }
    // 4. Prisma Errors
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': // Unique constraint violation
          status = HttpStatus.CONFLICT;
          message = `Duplicate field: ${exception.meta?.target}`;
          break;
        case 'P2025': // Record not found
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          break;
        case 'P2003': // Foreign key constraint
          status = HttpStatus.BAD_REQUEST;
          message = 'Related record not found';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = `Database error: ${exception.message}`;
      }
    }
    // 5. Unknown error
    else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Unhandled error: ${exception.stack}`);
    }

    //  LOG 
    this.logger.error(
      `HTTP ${status} - ${request.method} ${request.url} - ${message}`,
    );

        // Kiểm tra có phải API request không, trả về json cho api
        const isApiRequest = request.url.startsWith('/api') || request.headers.accept?.includes('app;ication/json');

    if (isApiRequest) {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message: message,
        errors: errors,
      });
    } else {
            //cho MVC trả về json tạm hoặc render trnag lỗi hoặc redirect
      response.status(status).json({
        statusCode: status,
        message: message,
      });
    }
  }
}