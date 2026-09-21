import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SseModule } from '../sse/sse.module';
import { BookingsApiController } from './bookings-api.controller'; 
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, PrismaModule, SseModule],
  controllers: [BookingsController, BookingsApiController,],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}