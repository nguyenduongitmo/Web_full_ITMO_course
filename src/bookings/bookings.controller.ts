import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Redirect } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { SseService } from '../sse/sse.service';

@Controller('admin/bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly sseService: SseService, 
  ) { }

  // - QUAN TRỌNG: ĐẶT :id/edit TRƯỚC :id -
  @Get(':id/edit')
  @Render('admin/bookings/edit')
  async editPage(@Param('id') id: string) {
    const booking = await this.bookingsService.findOne(id);
    if (!booking) return { redirect: '/admin/bookings' };
    return {
      title: 'Sửa đặt tour',
      isLoggedIn: true,
      username: 'Admin',
      booking: booking,
      currentPath: '/admin/bookings',
      showBanner: false,
    };
  }

  @Get(':id')
  @Render('admin/bookings/detail')
  async findOne(@Param('id') id: string) {
    const booking = await this.bookingsService.findOne(id);
    if (!booking) return { redirect: '/admin/bookings' };
    return {
      title: 'Chi tiết đặt tour',
      isLoggedIn: true,
      username: 'Admin',
      booking: booking,
      currentPath: '/admin/bookings',
      showBanner: false,
    };
  }

  @Get()
  @Render('admin/bookings/index')
  async findAll() {
    const bookings = await this.bookingsService.findAll();
    return {
      title: 'Quản lý đặt tour',
      isLoggedIn: true,
      username: 'Admin',
      bookings: bookings,
      currentPath: '/admin/bookings',
      showBanner: false,
    };
  }

  @Post()
  @Redirect('/admin/bookings')
  async create(@Body() createBookingDto: CreateBookingDto) {
    const booking = await this.bookingsService.create(createBookingDto);
    
    // Dùng SseService thay vì Subject riêng
    this.sseService.emit({
      type: 'create',
      message: `Booking của "${booking.fullName}" đã được tạo!`,
      module: 'bookings',
      data: booking,
      timestamp: new Date().toISOString(),
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/bookings' };
  }

  @Patch(':id')
  @Redirect('/admin/bookings')
  async update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    const booking = await this.bookingsService.update(id, updateBookingDto);
    
    this.sseService.emit({
      type: 'update',
      message: `Booking của "${booking.fullName}" đã được cập nhật!`,
      module: 'bookings',
      data: booking,
      timestamp: new Date().toISOString(),
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/bookings' };
  }

  @Delete(':id')
  @Redirect('/admin/bookings')
  async remove(@Param('id') id: string) {
    const booking = await this.bookingsService.findOne(id);
    await this.bookingsService.remove(id);
    
    this.sseService.emit({
      type: 'delete',
      message: `Booking của "${booking?.fullName || '#' + id}" đã bị xóa!`,
      module: 'bookings',
      data: { id, fullName: booking?.fullName },
      timestamp: new Date().toISOString(),
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/bookings' };
  }
}