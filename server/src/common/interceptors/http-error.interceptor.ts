import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';
  
  @Injectable()
  export class HttpErrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        catchError(error => {
          if (error instanceof HttpException) {
            return throwError(() => error);
          }
  
          // Логирование ошибки
          console.error('Unexpected error:', error);
  
          return throwError(
            () =>
              new HttpException(
                'Internal server error',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
          );
        }),
      );
    }
  }
  