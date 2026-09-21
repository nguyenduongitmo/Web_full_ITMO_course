import { Controller, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';
import { Public } from '../auth/auth.decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; 

@Controller('api/events')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Public()
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