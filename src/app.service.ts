import { Injectable } from '@nestjs/common';
import { ToursService } from './tours/tours.service'; 

@Injectable()
export class AppService {
  constructor(private readonly toursService: ToursService) {}

  // Trang chủ
  async getHomePageData(user?: any) {
    const featuredTours = await this.toursService.findFeatured(3);

    return {
      title: 'ROYAL TRAVEL - Trang chủ',
      user: user || null,
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
  async getToursPageData(search?: string, user?: any) {
    const tours = await this.toursService.findAll(search);

    return {
      title: 'ROYAL TRAVEL - Tour du lịch',
      user: user || null,
      tours: tours,
    };
  }

   async getTourDetail(id: string, user?: any) {
    const tour = await this.toursService.findOne(id);
    return {
      tour: tour,
      user: user || null
    }
  }

  // Trang liên hệ
  async getContactPageData(user?: any) {
    return {
      title: 'ROYAL TRAVEL - Liên hệ',
      user:user || null,
      email: 'info@royaltravel.com',
      phone: '+79523747668',
    };
  }
}