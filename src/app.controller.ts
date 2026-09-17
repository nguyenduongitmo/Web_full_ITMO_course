import { Controller, Get, Render, Param, Query, Req,  UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request } from 'express'; 
import { Public } from './auth/auth.decorators'; 
import { AuthGuard } from './auth/auth.guard';
import { Roles } from './auth/auth.decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Trang chủ
  @Public()
  @Get()
  @Render('user/index')
  async getHomePage(@Req() req:Request) {
    const user = req['user'] || null; // lấy user từ middleware
    const data = await this.appService.getHomePageData(user);
    return {
      ...data,
      currentPath: '/',
      showBanner: true,
      searchQuery: '',
    };
  }

  // Trang tour
  @Public()
  @Get('user/tours/:id')
  @Render('user/tour-detail')
  async getTourDetail(@Param('id') id: string, @Req() req:Request) {
    const user = req['user'] || null;
    const result = await this.appService.getTourDetail(id, user);
    if (!result.tour) return { redirect: '/tours' };
    return {
      title: `ROYAL TRAVEL - ${result.tour.name}`,
      user: result.user,
      tour: result.tour,
      currentPath: '/tours',
      showBanner: false,
      includeSSE: true,
    };
  }
  
  @Public()
  @Get('user/tours')
  @Render('user/tours')
  async getToursPage(@Req() req: Request, @Query('search') search?: string) {
    const user = req['user'] || null;
    const data = await this.appService.getToursPageData(search, user);
    return {
      ...data,

      currentPath: '/tours',
      showBanner: false,
      searchQuery: search || '', //  Truyền search vào view
    };
  }

  

  // Trang liên hệ
  @Public()
  @Get('contact')
  @Render('user/contact')
  async getContactPage(@Req() req: Request) {
    const user = req['user'] || null;
    const data = await this.appService.getContactPageData(user);
    return {
      ...data,
      user: req['user'] || null,
      currentPath: '/contact',
      showBanner: false,
      searchQuery: '',
      extraScripts: `
        <script src="/js/feedback.js" defer></script>
        <script src="/js/api-feedback.js" defer></script>
      `,
    };
  }

  @Get('admin')
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  @Render('admin/index')
  async getAdminPage(@Req() req: Request) {
    const user = req['user'] || null;
    return {
      title: 'ROYAL TRAVEL - Trang quản trị',
      user: user,
      currentPath: '/admin',
      showBanner: false,
    };
  }
}