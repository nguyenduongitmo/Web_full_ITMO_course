import { Module} from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Cần Prisma để Service dùng
import { SseModule } from '../sse/sse.module';
import { ToursApiController } from './tours-api.controller'; 

@Module({
  imports: [PrismaModule, SseModule, CacheModule.register({ ttl:10, max:100,})], // Import PrismaModule để service có thể inject PrismaService
  controllers: [ToursController, ToursApiController],
  providers: [ToursService],
  exports: [ToursService], // Nếu module khác cần dùng ToursService
})
export class ToursModule {} 
