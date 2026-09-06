import { Injectable } from '@nestjs/common';
import { ToursService } from './tours/tours.service'; 

@Injectable()
export class AppService {
  constructor(private readonly toursService: ToursService) {}

  // Trang chủ
  async getHomePageData() {
    const featuredTours = await this.toursService.findFeatured(3);

    return {
      title: 'ROYAL TRAVEL - Trang chủ',
      isLoggedIn: false,
      username: null,
      featuredTours: featuredTours,
      mission: 'Dùng trải nghiệm văn hóa đặc sắc để chuẩn bị hành trang cho thế hệ tương lai.',
      vision: 'Trở thành đơn vị hàng đầu trong lĩnh vực du ngoại cho thế hệ trẻ.',
      coreValues: [
        'Cầu tiến không ngừng',
        'Chất lượng quốc tế'
      ],
      notes: [
        '<ins>Tour có thể thay đổi lịch trình tùy vào điều kiện thời tiết.</ins>',
        '<del>Giá tour có thể thay đổi tùy vào thời điểm đặt tour.</del>',
        '<ins>Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.</ins>'
      ]
    };
  }

  // Trang tour
  async getToursPageData(search?: string) {
    const tours = await this.toursService.findAll(search);

    return {
      title: 'ROYAL TRAVEL - Tour du lịch',
      isLoggedIn: false,
      username: null,
      tours: tours,
    };
  }

   async getTourDetail(id: string) {
    return await this.toursService.findOne(id);
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