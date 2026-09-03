import { Controller, Get, Render, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Trang chủ
  @Get()
  @Render('user/index')
  async getHomePage() {
    const data = await this.appService.getHomePageData();
    return {
      ...data,
      currentPath: '/',
      showBanner: true,
      searchQuery: '',
    };
  }

  // Trang tour

  @Get('tours/:id')
  @Render('user/tour-detail')
  async getTourDetail(@Param('id') id: string) {
    const tour = await this.appService.getTourDetail(id);
    if (!tour) return { redirect: '/tours' };
    return {
      title: `ROYAL TRAVEL - ${tour.name}`,
      isLoggedIn: false,
      username: null,
      tour: tour,
      currentPath: '/tours',
      showBanner: false,
      includeSSE: true,
    };
  }
  
  @Get('tours')
  @Render('user/tours')
  async getToursPage() {
    const data = await this.appService.getToursPageData();
    return {
      ...data,
      currentPath: '/tours',
      showBanner: false,
      searchQuery: '',
    };
  }

  

  // Trang liên hệ
  @Get('contact')
  @Render('user/contact')
  async getContactPage() {
    const data = await this.appService.getContactPageData();
    return {
      ...data,
      currentPath: '/contact',
      showBanner: false,
      searchQuery: '',
      extraScripts: `
        <script src="/js/feedback.js" defer></script>
        <script src="/js/api-feedback.js" defer></script>
      `,
    };
  }
}