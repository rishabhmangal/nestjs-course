import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('HTTP exception handler triggered', JSON.stringify(exception));

    const ctx = host.switchToHttp(); //To define response to HTTP need Request & Response object

    const response = ctx.getResponse(),
      //request = ctx.getRequest(),
      statusCode = exception.getStatus();

    return response.status(statusCode).json({
      status: statusCode,
      createdBy: 'HttpExceptionFilter',
      errorMessage: exception.message,
    });
  }
}
