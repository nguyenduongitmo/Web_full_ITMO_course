import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Redirect } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Controller('admin/feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Get()
  @Render('pages/admin-feedbacks')
  async findAll() {
    const feedbacks = await this.feedbacksService.findAll();
    return {
      title: 'ROYAL TRAVEL - Quản lý đánh giá',
      isLoggedIn: false,
      username: null,
      feedbacks: feedbacks,
      currentPath: '/admin/feedbacks',
      showBanner: false,
    };
  }

  @Get(':id')
  @Render('pages/admin-feedback-detail')
  async findOne(@Param('id') id: string) {
    const feedback = await this.feedbacksService.findOne(id);
    if (!feedback) return { redirect: '/admin/feedbacks' };
    return {
      title: 'ROYAL TRAVEL - Chi tiết đánh giá',
      isLoggedIn: false,
      username: null,
      feedback: feedback,
      currentPath: '/admin/feedbacks',
      showBanner: false,
    };
  }

  @Post()
  async create(@Body() createFeedbackDto: CreateFeedbackDto) {
    const feedback = await this.feedbacksService.create(createFeedbackDto);
    return { url: `/admin/feedbacks/${feedback.id}` };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    await this.feedbacksService.update(id, updateFeedbackDto);
    return { url: `/admin/feedbacks/${id}` };
  }

  @Delete(':id')
  @Redirect('/admin/feedbacks')
  async remove(@Param('id') id: string) {
    await this.feedbacksService.remove(id);
    return { url: '/admin/feedbacks' };
  }
}