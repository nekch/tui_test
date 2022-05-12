import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
  HttpException
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        error: (err) => {
          if (err instanceof HttpException) {
            return err;
          }

          throw new BadGatewayException();
        }
      }),
    );
  }
}
