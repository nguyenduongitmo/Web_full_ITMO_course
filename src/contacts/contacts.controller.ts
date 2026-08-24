import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Redirect } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('admin/contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @Render('pages/admin-contacts')
  async findAll() {
    const contacts = await this.contactsService.findAll();
    return {
      title: 'ROYAL TRAVEL - Quản lý liên hệ',
      isLoggedIn: false,
      username: null,
      contacts: contacts,
      currentPath: '/admin/contacts',
      showBanner: false,
    };
  }

  @Get(':id')
  @Render('pages/admin-contact-detail')
  async findOne(@Param('id') id: string) {
    const contact = await this.contactsService.findOne(id);
    if (!contact) return { redirect: '/admin/contacts' };
    return {
      title: 'ROYAL TRAVEL - Chi tiết liên hệ',
      isLoggedIn: false,
      username: null,
      contact: contact,
      currentPath: '/admin/contacts',
      showBanner: false,
    };
  }

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    const contact = await this.contactsService.create(createContactDto);
    return { url: `/admin/contacts/${contact.id}` };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    await this.contactsService.update(id, updateContactDto);
    return { url: `/admin/contacts/${id}` };
  }

  @Delete(':id')
  @Redirect('/admin/contacts')
  async remove(@Param('id') id: string) {
    await this.contactsService.remove(id);
    return { url: '/admin/contacts' };
  }
}