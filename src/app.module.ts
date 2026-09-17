import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ToursModule } from './tours/tours.module';
import { BookingsModule } from './bookings/bookings.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { ContactsModule } from './contacts/contacts.module';
import { SseModule } from './sse/sse.module';
import { GraphqlModule } from './graphql/graphql.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { StorageModule } from './storage/storage.module';
import { ElapsedTimeInterceptor } from './common/interceptors/elapsed-time.interceptor';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, ToursModule, BookingsModule, FeedbacksModule, ContactsModule, SseModule, GraphqlModule, StorageModule, AuthModule.forRoot(process.env.JWT_SECRET),],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: ElapsedTimeInterceptor,
  },],
})
export class AppModule { }
