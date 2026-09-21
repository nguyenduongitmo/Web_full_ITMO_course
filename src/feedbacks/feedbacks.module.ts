import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SseModule } from '../sse/sse.module';
import { FeedbacksApiController } from './feedbacks-api.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, PrismaModule, SseModule],
  controllers: [FeedbacksController, FeedbacksApiController,],
  providers: [FeedbacksService],
  exports: [FeedbacksService],
})

export class FeedbacksModule {}