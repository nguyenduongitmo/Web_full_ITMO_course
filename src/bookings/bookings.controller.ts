import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Redirect } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('admin/bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @Render('pages/admin-bookings')
  async findAll() {
    const bookings = await this.bookingsService.findAll();
    return {
      title: 'ROYAL TRAVEL - Quản lý đặt tour',
      isLoggedIn: false,
      username: null,
      bookings: bookings,
      currentPath: '/admin/bookings',
      showBanner: false,
    };
  }

  @Get(':id')
  @Render('pages/admin-booking-detail')
  async findOne(@Param('id') id: string) {
    const booking = await this.bookingsService.findOne(id);
    if (!booking) return { redirect: '/admin/bookings' };
    return {
      title: 'ROYAL TRAVEL - Chi tiết đặt tour',
      isLoggedIn: false,
      username: null,
      booking: booking,
      currentPath: '/admin/bookings',
      showBanner: false,
    };
  }

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    const booking = await this.bookingsService.create(createBookingDto);
    return { url: `/admin/bookings/${booking.id}` };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    await this.bookingsService.update(id, updateBookingDto);
    return { url: `/admin/bookings/${id}` };
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    await this.bookingsService.updateStatus(id, status);
    return { url: `/admin/bookings/${id}` };
  }

  @Delete(':id')
  @Redirect('/admin/bookings')
  async remove(@Param('id') id: string) {
    await this.bookingsService.remove(id);
    return { url: '/admin/bookings' };
  }
}