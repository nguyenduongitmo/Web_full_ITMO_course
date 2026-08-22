import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  // Trang chủ
  async getHomePageData() {
    const featuredTours = await this.prisma.tour.findMany({
      where: { isFeatured: true },
      take: 3,
    });

    return {
      title: 'ROYAL TRAVEL - Trang chủ',
      isLoggedIn: false,
      username: null,
      featuredTours: featuredTours,
      mission: 'Dùng trải nghiệm văn hóa đặc sắc để chuẩn bị hành trang cho thế hệ tương lai.',
      vision: 'Trở thành đơn vị hàng đầu trong lĩnh vực du ngoại cho thế hệ trẻ.',
      coreValues: [
        '<strong>Cầu tiến không ngừng</strong>',
        '<em>Chất lượng quốc tế</em>',
        '<del>Thiếu sáng tạo</del> <ins>Tận tâm sáng tạo</ins>'
      ],
      notes: [
        '<ins>Tour có thể thay đổi lịch trình tùy vào điều kiện thời tiết.</ins>',
        '<del>Giá tour có thể thay đổi tùy vào thời điểm đặt tour.</del>',
        '<ins>Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.</ins>'
      ]
    };
  }

  // Trang tour
  async getToursPageData() {
    const tours = await this.prisma.tour.findMany({
      orderBy: { name: 'asc' },
    });

    return {
      title: 'ROYAL TRAVEL - Tour du lịch',
      isLoggedIn: false,
      username: null,
      tours: tours,
    };
  }

  // Trang liên hệ
  async getContactPageData() {
    return {
      title: 'ROYAL TRAVEL - Liên hệ',
      isLoggedIn: false,
      username: null,
      email: 'info@royaltravel.com',
      phone: '+79523747668',
    };
  }
}