import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SseModule } from '../sse/sse.module';
import { ContactsApiController } from './contacts-api.controller'; 

@Module({
  imports: [PrismaModule, SseModule],
  controllers: [ContactsController, ContactsApiController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}