import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception.response?.message instanceof Array
        ? exception.response.message.join(', ')
        : exception.response?.message ||
          exception.message ||
          'An error occurred';

    response.status(status).json({
      message,
      error: exception.name || 'Error',
      status,
    });
  }
}