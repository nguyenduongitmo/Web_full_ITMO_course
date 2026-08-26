import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Redirect, Sse } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Controller('admin/feedbacks')
export class FeedbacksController {
  private feedbackEvents = new Subject<any>();

  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Get()
  @Render('pages/admin-feedbacks')
  async findAll() {
    const feedbacks = await this.feedbacksService.findAll();
    return {
      title: 'ROYAL TRAVEL - Quản lý đánh giá',
      isLoggedIn: true,
      username: 'Admin',
      feedbacks: feedbacks,
      currentPath: '/admin/feedbacks',
      showBanner: false,
    };
  }

  @Get(':id/edit')
  @Render('pages/admin-feedback-edit')
  async editPage(@Param('id') id: string) {
    const feedback = await this.feedbacksService.findOne(id);
    if (!feedback) return { redirect: '/admin/feedbacks' };
    return {
      title: 'ROYAL TRAVEL - Sửa đánh giá',
      isLoggedIn: true,
      username: 'Admin',
      feedback: feedback,
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
      isLoggedIn: true,
      username: 'Admin',
      feedback: feedback,
      currentPath: '/admin/feedbacks',
      showBanner: false,
    };
  }

  @Post()
  @Redirect('/admin/feedbacks')
  async create(@Body() createFeedbackDto: CreateFeedbackDto) {
    const feedback = await this.feedbacksService.create(createFeedbackDto);
    
    this.feedbackEvents.next({
      type: 'create',
      message: `Đánh giá của "${feedback.fullName}" đã được tạo!`,
      module: 'feedbacks',
      data: feedback,
      timestamp: new Date().toISOString(),
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/feedbacks' };
  }

  @Patch(':id')
  @Redirect('/admin/feedbacks')
  async update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    const feedback = await this.feedbacksService.update(id, updateFeedbackDto);
    
    this.feedbackEvents.next({
      type: 'update',
      message: `Đánh giá của "${feedback.fullName}" đã được cập nhật!`,
      module: 'feedbacks',
      data: feedback,
      timestamp: new Date().toISOString(),
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/feedbacks' };
  }

  @Delete(':id')
  @Redirect('/admin/feedbacks')
  async remove(@Param('id') id: string) {
    const feedback = await this.feedbacksService.findOne(id);
    await this.feedbacksService.remove(id);
    
    this.feedbackEvents.next({
      type: 'delete',
      message: `Đánh giá của "${feedback?.fullName || '#' + id}" đã bị xóa!`,
      module: 'feedbacks',
      data: { id, fullName: feedback?.fullName },
      timestamp: new Date().toISOString(),
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/feedbacks' };
  }

  @Sse('events')
sse(): Observable<any> {
  console.log('Feedbacks SSE connected!');
  return new Observable((observer) => {
    const subscription = this.feedbackEvents.subscribe({
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