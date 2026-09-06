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


@Module({
  imports: [PrismaModule, ToursModule, BookingsModule, FeedbacksModule, ContactsModule,  SseModule, GraphqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
