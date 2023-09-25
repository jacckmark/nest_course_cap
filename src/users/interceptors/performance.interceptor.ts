import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Interceptor works before');
    console.time('TIMER');
    return next.handle().pipe(
      tap((res) => {
        console.log('Interceptor works after', res);
        console.timeEnd('TIMER');
      }),
    );
  }
}
