import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Redirect, Sse , Req, UseGuards} from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { SseService } from '../sse/sse.service';
import { Roles, CurrentUser } from '../auth/auth.decorators';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; 

@ApiTags('Admin - Contacts')  
@ApiBearerAuth('JWT-auth')
@Controller('admin/contacts')
@UseGuards(AuthGuard)
@Roles('ADMIN')
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly sseService: SseService,
  ) {}

  @Get(':id/edit')
  @Render('admin/contacts/edit')
  async editPage(@Param('id') id: string, @Req() req: Request) {
    const contact = await this.contactsService.findOne(id);
    if (!contact) return { redirect: '/admin/contacts' };
    return {
      title: 'Sửa liên hệ',
      user: req['user'] || null,
      contact: contact,
      currentPath: '/admin/contacts',
      showBanner: false,
    };
  }

  @Get(':id')
  @Render('admin/contacts/detail')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const contact = await this.contactsService.findOne(id);
    if (!contact) return { redirect: '/admin/contacts' };
    return {
      title: 'Chi tiết liên hệ',
      user: req['user'] || null,
      contact: contact,
      currentPath: '/admin/contacts',
      showBanner: false,
    };
  }

  @Get()
  @Render('admin/contacts/index')
  async findAll(@Req() req: Request) {
    const contacts = await this.contactsService.findAll();
    return {
      title: 'Quản lý liên hệ',
      user: req['user'] || null,
      contacts: contacts,
      currentPath: '/admin/contacts',
      showBanner: false,
    };
  }

  @Post()
  @Redirect('/admin/contacts')
  async create(@Body() createContactDto: CreateContactDto, @CurrentUser() user: any) {
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
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto, @CurrentUser() user: any) {
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
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
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