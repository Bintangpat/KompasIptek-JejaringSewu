import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'ERR_INTERNAL_SERVER';
    let message: any = 'Terjadi kesalahan pada server internal.';

    // 1. Tangkap NestJS HttpException (termasuk ValidationPipe & ThrottlerException)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resBody = exception.getResponse() as any;
      message = resBody.message || exception.message;
      errorCode = resBody.errorCode || this.mapHttpToAppCode(status);
    }
    // 2. Tangkap Prisma Client Known Request Error (Anti-Leak Database Structure)
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        errorCode = 'ERR_DUPLICATE_ENTRY';
        message = `Data pada kolom ${(exception.meta?.target as string[])?.join(', ')} sudah terdaftar.`;
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        errorCode = 'ERR_RESOURCE_NOT_FOUND';
        message = 'Data yang diminta tidak ditemukan di dalam sistem.';
      } else if (exception.code === 'P2034') {
        status = HttpStatus.CONFLICT;
        errorCode = 'ERR_CONCURRENCY_LOCK';
        message = 'Transaksi sedang diproses bersamaan, silakan coba sesaat lagi.';
      }
    }

    this.logger.error(`[${request.method}] ${request.url} -> ${errorCode}`, exception instanceof Error ? exception.stack : '');

    response.status(status).json({
      success: false,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private mapHttpToAppCode(status: number): string {
    switch (status) {
      case 400: return 'ERR_VALIDATION_FAILED';
      case 401: return 'ERR_AUTH_UNAUTHORIZED';
      case 403: return 'ERR_FORBIDDEN_ROLE_ACCESS';
      case 404: return 'ERR_RESOURCE_NOT_FOUND';
      case 409: return 'ERR_CONFLICT_STATE';
      case 429: return 'ERR_RATE_LIMIT_EXCEEDED';
      default: return 'ERR_INTERNAL_SERVER';
    }
  }
}
