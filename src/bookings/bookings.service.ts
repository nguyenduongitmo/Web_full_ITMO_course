import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async generateBookingCode(): Promise<string> {
    const count = await this.prisma.booking.count();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const sequence = String(count + 1).padStart(4, '0');
    return `BK-${year}${month}${day}-${sequence}`;
  }

  async create(createBookingDto: CreateBookingDto) {
    const tour = await this.prisma.tour.findUnique({
      where: { id: createBookingDto.tourId },
    });
    if (!tour) {
      throw new NotFoundException('Tour không tồn tại!');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: createBookingDto.userId },
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    const bookingCode = await this.generateBookingCode();

    const data = {
      bookingCode,
      userId: createBookingDto.userId,
      tourId: createBookingDto.tourId,
      fullName: createBookingDto.fullName,
      email: createBookingDto.email,
      phone: createBookingDto.phone || '',
      travelDate: new Date(createBookingDto.travelDate),
      passengers: createBookingDto.passengers || 1,
      status: createBookingDto.status || 'PENDING',
    };
    return await this.prisma.booking.create({ data });
  }

  async findAll() {
    return await this.prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        tour: { select: { id: true, name: true, code: true, price: true } },
      },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        tour: { select: { id: true, name: true, code: true, price: true, image: true } },
      },
    });
    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking!');
    }
    return booking;
  }

  async findByUser(userId: string) {
    return await this.prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { tour: true },
    });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const data: any = {};
    if (updateBookingDto.fullName) data.fullName = updateBookingDto.fullName;
    if (updateBookingDto.email) data.email = updateBookingDto.email;
    if (updateBookingDto.phone) data.phone = updateBookingDto.phone;
    if (updateBookingDto.travelDate) data.travelDate = new Date(updateBookingDto.travelDate);
    if (updateBookingDto.passengers !== undefined && updateBookingDto.passengers !== null) {
    data.passengers = Number(updateBookingDto.passengers);  // -> Ép sang Number
  }
    if (updateBookingDto.status) data.status = updateBookingDto.status;
    if (updateBookingDto.tourId) {
      const tour = await this.prisma.tour.findUnique({
        where: { id: updateBookingDto.tourId },
      });
      if (!tour) {
        throw new NotFoundException('Tour mới không tồn tại!');
      }
      data.tourId = updateBookingDto.tourId;
    }

    return await this.prisma.booking.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });
    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking!');
    }
    return await this.prisma.booking.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: string) {
    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Trạng thái không hợp lệ! Chấp nhận: ${validStatuses.join(', ')}`);
    }
    return await this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }
}