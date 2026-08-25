import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query, Redirect, Sse } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';

@Controller('admin/tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {} 
  private tourEvents = new Subject<any>();

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
    
    const eventData = {
      type: 'create',
      message: `Tour "${tour.name}" đã được tạo!`,
      timestamp: new Date().toISOString(),
    };
    
    this.tourEvents.next(eventData);
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/tours' };
  }

  @Patch(':id')
  @Redirect('/admin/tours')
  async update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    const tour = await this.toursService.update(id, updateTourDto);
    
    const eventData = {
      type: 'update',
      message: `Tour "${tour.name}" đã được cập nhật!`,
      timestamp: new Date().toISOString(),
    };
    
    this.tourEvents.next(eventData);
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/tours' };
  }

  @Delete(':id')
  @Redirect('/admin/tours')
  async remove(@Param('id') id: string) {
    const tour = await this.toursService.findOne(id);
    await this.toursService.remove(id);
    
    const eventData = {
      type: 'delete',
      message: `Tour "${tour?.name || '#' + id}" đã bị xóa!`,
      timestamp: new Date().toISOString(),
    };
    
    this.tourEvents.next(eventData);
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/tours' };
  }

  @Sse('events')
  sse(): Observable<any> {
    return new Observable((observer) => {
      const subscription = this.tourEvents.subscribe({
        next: (data) => {
          observer.next({
            data: JSON.stringify(data),
            type: data.type,
          });
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
      
      return () => {
        subscription.unsubscribe();
      };
    });
  }
}