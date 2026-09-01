import { Controller, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';

@Controller('api/events')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse()
  sse(): Observable<any> {
    return new Observable((observer) => {
      const subscription = this.sseService.getEvents().subscribe({
        next: (data) => {
          observer.next({
            data: JSON.stringify(data),
            type: data.type,
          });
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });

      return () => subscription.unsubscribe();
    });
  }
}