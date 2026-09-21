import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Redirect, Sse, Req, UseGuards } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; 
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { SseService } from '../sse/sse.service';
import { Roles, CurrentUser } from '../auth/auth.decorators';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';

@ApiTags('Admin - Feedbacks')
@ApiBearerAuth('JWT-auth')
@Controller('admin/feedbacks')
@UseGuards(AuthGuard)
@Roles('ADMIN')
export class FeedbacksController {
  constructor(
    private readonly feedbacksService: FeedbacksService,
    private readonly sseService: SseService,
  ) {}

  @Get(':id/edit')
  @Render('admin/feedbacks/edit')
  async editPage(@Param('id') id: string, @Req() req: Request) {
    const feedback = await this.feedbacksService.findOne(id);
    if (!feedback) return { redirect: '/admin/feedbacks' };
    return {
      title: 'Sửa đánh giá',
      user: req['user'] || null,
      feedback: feedback,
      currentPath: '/admin/feedbacks',
      showBanner: false,
    };
  }

  @Get(':id')
  @Render('admin/feedbacks/detail')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const feedback = await this.feedbacksService.findOne(id);
    if (!feedback) return { redirect: '/admin/feedbacks' };
    return {
      title: 'Chi tiết đánh giá',
      user: req['user'] || null,
      feedback: feedback,
      currentPath: '/admin/feedbacks',
      showBanner: false,
    };
  }

  @Get()
  @Render('admin/feedbacks/index')
  async findAll(@Req() req: Request) {
    const feedbacks = await this.feedbacksService.findAll();
    return {
      title: 'Quản lý đánh giá',
      user: req['user'] || null,
      feedbacks: feedbacks,
      currentPath: '/admin/feedbacks',
      showBanner: false,
    };
  }

  @Post()
  @Redirect('/admin/feedbacks')
  async create(@Body() createFeedbackDto: CreateFeedbackDto, @CurrentUser() user: any) {
    const feedback = await this.feedbacksService.create(createFeedbackDto);
    
    this.sseService.emit({
      type: 'create',
      message: `Đánh giá của "${feedback.fullName}" đã được tạo bởi ${user.fullName}!`,
      module: 'feedbacks',
      data: feedback,
      timestamp: new Date().toISOString(),
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/feedbacks' };
  }

  @Patch(':id')
  @Redirect('/admin/feedbacks')
  async update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto, @CurrentUser() user: any) {
    const feedback = await this.feedbacksService.update(id, updateFeedbackDto);
    
    this.sseService.emit({
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
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    const feedback = await this.feedbacksService.findOne(id);
    await this.feedbacksService.remove(id);
    
    this.sseService.emit({
      type: 'delete',
      message: `Đánh giá của "${feedback?.fullName || '#' + id}" đã bị xóa!`,
      module: 'feedbacks',
      data: { id, fullName: feedback?.fullName },
      timestamp: new Date().toISOString(),
    });
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return { url: '/admin/feedbacks' };
  }
}