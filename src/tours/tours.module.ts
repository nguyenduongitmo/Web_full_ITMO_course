import { Module } from '@nestjs/common';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Cần Prisma để Service dùng
import { SseModule } from '../sse/sse.module';

@Module({
  imports: [PrismaModule, SseModule], // Import PrismaModule để service có thể inject PrismaService
  controllers: [ToursController],
  providers: [ToursService],
  exports: [ToursService], // Nếu module khác cần dùng ToursService
})
export class ToursModule {} 
