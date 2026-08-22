import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Trang chủ
  @Get()
  @Render('pages/index')
  async getHomePage() {
    const data = await this.appService.getHomePageData();
    return {
      ...data,
      currentPath: '/',
      showBanner: true,
      searchQuery: '', // ← THÊM DÒNG NÀY
    };
  }

  // Trang tour
  @Get('tours')
  @Render('pages/tours')
  async getToursPage() {
    const data = await this.appService.getToursPageData();
    return {
      ...data,
      currentPath: '/tours',
      showBanner: false,
      searchQuery: '', // ← THÊM DÒNG NÀY
    };
  }

  // Trang liên hệ
  @Get('contact')
  @Render('pages/contact')
  async getContactPage() {
    const data = await this.appService.getContactPageData();
    return {
      ...data,
      currentPath: '/contact',
      showBanner: false,
      searchQuery: '', // ← THÊM DÒNG NÀY
      extraScripts: `
        <script src="/js/feedback.js" defer></script>
        <script src="/js/api-feedback.js" defer></script>
      `,
    };
  }
}