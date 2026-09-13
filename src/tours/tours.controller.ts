import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Redirect, Sse, UseGuards, Req } from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { SseService } from '../sse/sse.service';
import { Roles, CurrentUser } from '../auth/auth.decorators';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';


@Controller('admin/tours')
@UseGuards(AuthGuard)// bảo vệ toàn bộ admin route
@Roles('ADMIN')  
export class ToursController {
  constructor(
    private readonly toursService: ToursService,
    private readonly sseService: SseService,
  ) {}

  @Get('create')
  @Render('admin/tours/create')
  createPage(@Req() req: Request) {
    return {
      title: 'Tạo tour mới',
      user: req['user'] || null,
      currentPath: '/admin/tours',
      showBanner: false,
    };
  }

  @Get(':id/edit')
  @Render('admin/tours/edit')
  async editPage(@Param('id') id: string, @Req() req: Request) {
    const tour = await this.toursService.findOne(id);
    if (!tour) return { redirect: '/admin/tours' };
    return {
      title: 'Sửa tour',
      user: req['user'] || null, 
      tour: tour,
      currentPath: '/admin/tours',
      showBanner: false,
    };
  }

  @Get(':id')
  @Render('admin/tours/detail')
  async findOne(@Param('id') id: string,  @Req() req: Request) {
    const tour = await this.toursService.findOne(id);
    if (!tour) return { redirect: '/admin/tours' };
    return {
      title: 'Chi tiết tour',
      user: req['user'] || null, 
      tour: tour,
      currentPath: '/admin/tours',
      showBanner: false,
    };
  }

  @Get()
  @Render('admin/tours/index')
  async findAll(@Req() req: Request) {
    const tours = await this.toursService.findAll();
    return {
      title: 'Quản lý tour',
      user: req['user'] || null, 
      tours: tours,
      currentPath: '/admin/tours',
      showBanner: false,
    };
  }

  @Post()
  @Redirect('/admin/tours')
  async create(@Body() createTourDto: CreateTourDto, @CurrentUser() user: any) {
    const tour = await this.toursService.create(createTourDto);
    
    // Dùng SseService để gửi event
    this.sseService.emit({
      type: 'create',
      message: `Tour "${tour.name}" đã được tạo bởi ${user.fullName}!`,
      module: 'tours',
      data: tour,
      timestamp: new Date().toISOString(),
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/tours' };
  }

  @Patch(':id')
  @Redirect('/admin/tours')
  async update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto, @CurrentUser() user: any) {
    const tour = await this.toursService.update(id, updateTourDto);
    
    this.sseService.emit({
      type: 'update',
      message: `Tour "${tour.name}" đã được cập nhật bởi ${user.fullName}!`,
      module: 'tours',
      data: tour,
      timestamp: new Date().toISOString(),
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/tours' };
  }

  @Delete(':id')
  @Redirect('/admin/tours')
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    const tour = await this.toursService.findOne(id);
    await this.toursService.remove(id);
    
    this.sseService.emit({
      type: 'delete',
      message: `Tour "${tour?.name || '#' + id}" đã bị xóa bởi ${user.fullName}!`,
      module: 'tours',
      data: { id, name: tour?.name },
      timestamp: new Date().toISOString(),
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/tours' };
  }
}