import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';


@Injectable()
export class ToursService {
  // Inject Prismaservice để dùng Database
  // khai báo thoe cú pháp typescript tên biến : kiểu dữ liệu, 
    // ở đây tạo biến prisma có kiểu PrismaService có thể dùng this.prisma cho toàn bộ class
  constructor(private prisma: PrismaService){}

  async generateTourCode(): Promise<string> {
    // Đếm số lượng tour hiện có
    const count = await this.prisma.tour.count();
    // Tạo số thứ tự (ví dụ: 1 -> 01, 10 ->10)
    const sequence = String(count + 1).padStart(2, '0');
    return `#ROYAL-${sequence}-VN-RU`;
  }

  async create(createTourDto: CreateTourDto) {
    // prisma.tour.create = tạo recode mới trong bảng Tour
    // Tự động tạo code nếu không có hoặc để trống
    let code = createTourDto.code;
    if (!code || code.trim() === '') {
      code = await this.generateTourCode();
    } else {
      // Nếu người dùng nhập code, kiểm tra trùng
      const existing = await this.prisma.tour.findUnique({
        where: { code },
      });
      if (existing) {
        throw new Error(`Mã tour "${code}" đã tồn tại! Vui lòng chọn mã khác hoặc để trống để tự động tạo.`);
      }
    }

    const data = {
      name: createTourDto.name,
      image: createTourDto.image || 'default.jpg',  // -> Nếu không có ảnh, dùng ảnh mặc định
      description: createTourDto.description,
      code: code, // -> Code đã được tạo tự động
      price: createTourDto.price ? parseFloat(createTourDto.price as any) : null,  // -> Chuyển sang số
      duration: createTourDto.duration || 'Chưa cập nhật',
      isFeatured: createTourDto.isFeatured === true,  // -> Chuyển sang boolean
    };
    return await this.prisma.tour.create({
        data,
    });
  }

  async findAll() {
    // findMay = lấy tất cả record
    return await this.prisma.tour.findMany({
      orderBy: {name: 'asc'},
    });
  }

  async findOne(id: string) {
    // findUnique = tìm theo id duy nhất, lấy 1 tour theo id
    return await this.prisma.tour.findUnique({
      where: {id},
    }) ;
  }

  async update(id: string, updateTourDto: UpdateTourDto) {
    // update = cập nhật record có id
    // Chỉ cập nhật các field được gửi lên
    const data: any = {};
    if (updateTourDto.name) data.name = updateTourDto.name;
    if (updateTourDto.image) data.image = updateTourDto.image;
    if (updateTourDto.description) data.description = updateTourDto.description;
    // Xử lý code khi update
    if (updateTourDto.code) {
      const existing = await this.prisma.tour.findUnique({
        where: { code: updateTourDto.code },
      });
      if (existing && existing.id !== id) {
        throw new Error(`Mã tour "${updateTourDto.code}" đã được sử dụng bởi tour khác!`);
      }
      data.code = updateTourDto.code;
    }
    if (updateTourDto.price !== undefined && updateTourDto.price !== null) {
      const priceValue = updateTourDto.price as any;
      data.price = typeof priceValue === 'string' ? parseFloat(priceValue) : priceValue;
    }
    if (updateTourDto.duration) data.duration = updateTourDto.duration;
    if (updateTourDto.isFeatured !== undefined && updateTourDto.isFeatured !== null) {
      const featuredValue = updateTourDto.isFeatured as any;
      data.isFeatured = featuredValue === 'true' || featuredValue === true;
    }
    
    return await this.prisma.tour.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    // detele = xóa record có id
    return await this.prisma.tour.delete({
      where: {id},
    });
  }
}
