import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface SseEvent {
  type: 'create' | 'update' | 'delete';
  message: string;
  module: 'tours' | 'bookings' | 'feedbacks' | 'contacts';
  data?: any;
  timestamp: string;
}

@Injectable()
export class SseService {
  private events = new Subject<SseEvent>();

  emit(event: SseEvent) {
    this.events.next(event);
  }

  getEvents() {
    return this.events.asObservable();
  }
}