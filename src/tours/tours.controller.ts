import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query, Redirect, Sse } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { SseService } from '../sse/sse.service';

@Controller('admin/tours')
export class ToursController {
  constructor(private readonly toursService: ToursService,
    private readonly sseService: SseService, //  Inject SseService
  ) {}

  @Get('create')
  @Render('pages/admin-tour-create')
  createPage() {
    return {
      title: 'ROYAL TRAVEL - Tạo tour mới',
      isLoggedIn: true,
      username: 'Admin',
      currentPath: '/admin/tours',
      showBanner: false,
    };
  }

@Get(':id')
@Render('pages/admin-tour-detail')
async findOne(@Param('id') id: string) {
  const tour = await this.toursService.findOne(id);
  if (!tour) return { redirect: '/admin/tours' };
  return {
    title: 'ROYAL TRAVEL - Chi tiết tour',
    isLoggedIn: true,
    username: 'Admin',
    tour: tour,
    currentPath: '/admin/tours',
    showBanner: false,
  };
}

  @Get(':id/edit')
  @Render('pages/admin-tour-edit')
  async editPage(@Param('id') id: string) {
    const tour = await this.toursService.findOne(id);
    if (!tour) return { redirect: '/admin/tours' };
    return {
      title: 'ROYAL TRAVEL - Sửa tour',
      isLoggedIn: true,
      username: 'Admin',
      tour: tour,
      currentPath: '/admin/tours',
      showBanner: false,
    };
  }

  @Get()
  @Render('pages/admin-tours')
  async findAll() {
    const tours = await this.toursService.findAll();
    return {
      title: 'ROYAL TRAVEL - Quản lý tour',
      isLoggedIn: true,
      username: 'Admin',
      tours: tours,
      currentPath: '/admin/tours',
      showBanner: false,
    };
  }

  @Post()
  @Redirect('/admin/tours')
  async create(@Body() createTourDto: CreateTourDto) {
    const tour = await this.toursService.create(createTourDto);
    
    // Dùng SseService để gửi event
    this.sseService.emit({
      type: 'create',
      message: `Tour "${tour.name}" đã được tạo!`,
      module: 'tours',
      data: tour,
      timestamp: new Date().toISOString(),
    }as any);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/tours' };
  }

  @Patch(':id')
  @Redirect('/admin/tours')
  async update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    const tour = await this.toursService.update(id, updateTourDto);
    
    this.sseService.emit({
      type: 'update',
      message: `Tour "${tour.name}" đã được cập nhật!`,
      module: 'tours',
      data: tour,
      timestamp: new Date().toISOString(),
    }as any);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/tours' };
  }

  @Delete(':id')
  @Redirect('/admin/tours')
  async remove(@Param('id') id: string) {
    const tour = await this.toursService.findOne(id);
    await this.toursService.remove(id);
    
    this.sseService.emit({
      type: 'delete',
      message: `Tour "${tour?.name || '#' + id}" đã bị xóa!`,
      module: 'tours',
      data: { id, name: tour?.name },
      timestamp: new Date().toISOString(),
    }as any);  ;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/tours' };
  }
}