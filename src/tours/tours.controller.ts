import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query, Redirect} from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { STATUS_CODES } from 'http';

@Controller('tours') // Tất cả các route trong controller này đều bắt đầu bằng "/tours"
export class ToursController {
  constructor(private readonly toursService: ToursService) {} 

  // 1. DANH SÁCH TOUR - Tạm thời ai cũng xem
  // Route: GET / tours
  // Thêm @Render để trả về trang HTML thay vì JSON
  @Get() // Xử lý GET request đến /tours
  @Render('pages/tours') // Render file views/pages/tours.ejs
  async findAll() {
    const tours = await this.toursService.findAll();
    return {
      title: 'ROYAL TRAVEL - Tour du lịch',
      isLoggedIn: false,
      username: null,
      tours: tours,
      currentPath: '/tours',
      showBanner: false,
    };
  }

  // 2. TRANG TẠO TOUR - Tạm thời ai cũng vào
  @Get('create')
  @Render('pages/tour-create')
  createPage() {
    return {
      title: 'ROYAL TRAVEL - Tạo tour mới',
      isLoggedIn: false,
      username: null,
      currentPath: '/tours',
      showBanner: false,
    };
  }


  // 3. CHI TIẾT TOUR - Tạm thời ai cũng xem
  // Route: GET /tours/abc123
  @Get(':id')// Định nghĩa route có tham số
  @Render('pages/tour-detail')
  async findOne(@Param('id') id: string) { // lấy tham số từ URL
    const tour = await this.toursService.findOne(id);
    return {
    title: `ROYAL TRAVEL - ${tour?.name || "Tour"}`,
    isLoggedIn: false,
    username: null,
    tour: tour,
    currentPath: '/tours',
    showBanner: false,
    };
  }


  // 4. TRANG CHỈNH SỬA TOUR - Tạm thời ai cũng vào được
  @Get(':id/edit')
  @Render('pages/tour-edit')
  async editPage(@Param('id') id: string) {
    const tour = await this.toursService.findOne(id);
    return {
      title: 'ROYAL TRAVEL - Sửa tour',
      isLoggedIn: false,
      username: null,
      tour: tour,
      currentPath: '/tours',
      showBanner: false,
    };
  }

  // 5. API TẠO TOUR - Tạm thời ai cũng gọi được
  @Post()
  @Redirect('/tours')
  async create(@Body() createTourDto: CreateTourDto) {
    const tour = await this.toursService.create(createTourDto);
    return { 
      url: `/tours/${tour.id}` };
  }

  // 6. API CẬP NHẬT TOUR - Tạm thời ai cũng gọi được
  @Patch(':id')
  @Redirect('/tours')
  async update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    const tour = await this.toursService.update(id, updateTourDto);
    return { 
      url: `/tours/${id}` 
    };
  }

  // 7. API XÓA TOUR - Tạm thời ai cũng gọi được
  @Delete(':id')
  @Redirect('/tours')
  async remove(@Param('id') id: string) {
    await this.toursService.remove(id);
    return { url: '/tours' };
  }
}