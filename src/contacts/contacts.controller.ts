import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Redirect, Sse } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { SseService } from '../sse/sse.service';

@Controller('admin/contacts')
export class ContactsController {
  private contactEvents = new Subject<any>();

  constructor(
    private readonly contactsService: ContactsService,
    private readonly sseService: SseService,
  ) {}

  @Get()
  @Render('pages/admin-contacts')
  async findAll() {
    const contacts = await this.contactsService.findAll();
    return {
      title: 'ROYAL TRAVEL - Quản lý liên hệ',
      isLoggedIn: true,
      username: 'Admin',
      contacts: contacts,
      currentPath: '/admin/contacts',
      showBanner: false,
    };
  }

  @Get(':id/edit')
  @Render('pages/admin-contact-edit')
  async editPage(@Param('id') id: string) {
    const contact = await this.contactsService.findOne(id);
    if (!contact) return { redirect: '/admin/contacts' };
    return {
      title: 'ROYAL TRAVEL - Sửa liên hệ',
      isLoggedIn: true,
      username: 'Admin',
      contact: contact,
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
      isLoggedIn: true,
      username: 'Admin',
      contact: contact,
      currentPath: '/admin/contacts',
      showBanner: false,
    };
  }

  @Post()
  @Redirect('/admin/contacts')
  async create(@Body() createContactDto: CreateContactDto) {
    const contact = await this.contactsService.create(createContactDto);
    
    this.sseService.emit({
      type: 'create',
      message: `Liên hệ của "${contact.fullName}" đã được tạo!`,
      module: 'contacts',
      data: contact,
      timestamp: new Date().toISOString(),
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/contacts' };
  }

  @Patch(':id')
  @Redirect('/admin/contacts')
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    const contact = await this.contactsService.update(id, updateContactDto);
    
    this.sseService.emit({
      type: 'update',
      message: `Liên hệ của "${contact.fullName}" đã được cập nhật!`,
      module: 'contacts',
      data: contact,
      timestamp: new Date().toISOString(),
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/contacts' };
  }

  @Delete(':id')
  @Redirect('/admin/contacts')
  async remove(@Param('id') id: string) {
    const contact = await this.contactsService.findOne(id);
    await this.contactsService.remove(id);
    
    this.sseService.emit({
      type: 'delete',
      message: `Liên hệ của "${contact?.fullName || '#' + id}" đã bị xóa!`,
      module: 'contacts',
      data: { id, fullName: contact?.fullName },
      timestamp: new Date().toISOString(),
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/contacts' };
  }
}