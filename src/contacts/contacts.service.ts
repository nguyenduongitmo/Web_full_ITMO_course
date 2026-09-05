import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
  return await this.prisma.contact.create({
    data: {
      fullName: createContactDto.fullName,
      email: createContactDto.email,
      phone: createContactDto.phone,
      interest: createContactDto.interest,     
      destination: createContactDto.destination,
      budget: createContactDto.budget,
      travelDate: createContactDto.travelDate, 
      message: createContactDto.message,
      subscribe: createContactDto.subscribe || false,
    },
  });
}

async findAll() {
    return await this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });
    if (!contact) {
      throw new NotFoundException('Không tìm thấy liên hệ!');
    }
    return contact;
  }

async update(id: string, updateContactDto: UpdateContactDto) {
  // Thêm: ktra contact tồn tại
    await this.findOne(id);
    const data: any = {};
    if (updateContactDto.fullName) data.fullName = updateContactDto.fullName;
    if (updateContactDto.email) data.email = updateContactDto.email;
    if (updateContactDto.phone) data.phone = updateContactDto.phone;
     if (updateContactDto.interest) data.interest = updateContactDto.interest; 
     if (updateContactDto.destination) data.destination = updateContactDto.destination;
      if (updateContactDto.budget) data.budget = updateContactDto.budget;
       if (updateContactDto.travelDate) data.travelDate = updateContactDto.travelDate;  
    if (updateContactDto.message) data.message = updateContactDto.message;
    if (updateContactDto.subscribe !== undefined) data.subscribe = updateContactDto.subscribe;

    return await this.prisma.contact.update({
      where: { id },
      data,
    });
  }
    
  async remove(id: string) {
    // Thêm: ktra contact tồn tại
    await this.findOne(id);
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });
    if (!contact) {
      throw new NotFoundException('Không tìm thấy liên hệ!');
    }
    return await this.prisma.contact.delete({
      where: { id },
    });
  }
}
