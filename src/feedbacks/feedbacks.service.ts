import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbacksService {
  constructor(private prisma: PrismaService) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    const data = {
      fullName: createFeedbackDto.fullName,
      email: createFeedbackDto.email,
      rating: Number(createFeedbackDto.rating) || 5,
      comment: createFeedbackDto.comment,
      tourId: createFeedbackDto.tourId || null,
      userId: createFeedbackDto.userId || null,
    };
    return await this.prisma.feedback.create({ data });
  }

  async findAll() {
    return await this.prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tour: { select: { id: true, name: true } },
        user: { select: { id: true, fullName: true, email: true } },
      },
    });
  }

  async findOne(id: string) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
      include: {
        tour: { select: { id: true, name: true } },
        user: { select: { id: true, fullName: true, email: true } },
      },
    });
    if (!feedback) {
      throw new NotFoundException('Không tìm thấy đánh giá!');
    }
    return feedback;
  }

  async findByTour(tourId: string) {
    return await this.prisma.feedback.findMany({
      where: { tourId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    // Thêm: ktra feedback tồn tại
    await this.findOne(id);
    const data: any = {};
    if (updateFeedbackDto.fullName) data.fullName = updateFeedbackDto.fullName;
    if (updateFeedbackDto.email) data.email = updateFeedbackDto.email;
    if (updateFeedbackDto.rating !== undefined && updateFeedbackDto.rating !== null) {
    data.rating = Number(updateFeedbackDto.rating);}
    if (updateFeedbackDto.comment) data.comment = updateFeedbackDto.comment;
    if (updateFeedbackDto.tourId) data.tourId = updateFeedbackDto.tourId;

    return await this.prisma.feedback.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    // Thêm: ktra feedback tồn tại
    await this.findOne(id);
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
    });
    if (!feedback) {
      throw new NotFoundException('Không tìm thấy đánh giá!');
    }
    return await this.prisma.feedback.delete({
      where: { id },
    });
  }
}