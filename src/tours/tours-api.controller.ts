import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, UseFilters, UseInterceptors, NotFoundException  } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiConflictResponse } from "@nestjs/swagger";
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { PaginationInterceptor } from '../common/interceptors/pagination.interceptor';

@ApiTags('Tours') // Nhosm trong Swagger
@Controller('api/tours')
@UseFilters(HttpExceptionFilter)
export class ToursApiController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo tour mới' })
  @ApiBody({ type: CreateTourDto })
  @ApiCreatedResponse({ description: 'Tour đã được tạo thành công' })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiConflictResponse({ description: 'Mã tour đã tồn tại' })
  create(@Body() createTourDto: CreateTourDto) {
    return this.toursService.create(createTourDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tours có phân trang' })
  @ApiOkResponse({ description: 'Danh sách tours' })
  @UseInterceptors(PaginationInterceptor)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.toursService.findAll(paginationDto.search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết tour theo ID' })
  @ApiParam({ name: 'id', description: 'ID của tour' })
  @ApiOkResponse({ description: 'Chi tiết tour' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy tour' })
  async findOne(@Param('id') id: string) {
    const tour = await this.toursService.findOne(id);
    if (!tour) {
      throw new NotFoundException(`Tour with ID ${id} not found`);
    }
    return tour;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật tour' })
  @ApiParam({ name: 'id', description: 'ID của tour' })
  @ApiBody({ type: UpdateTourDto })
  @ApiOkResponse({ description: 'Tour đã được cập nhật' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy tour' })
  async update(
    @Param('id') id: string,
    @Body() updateTourDto: UpdateTourDto,
  ) {
    const tour = await this.toursService.update(id, updateTourDto);
    if (!tour) {
      throw new NotFoundException(`Tour with ID ${id} not found`);
    }
    return tour;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa tour' })
  @ApiParam({ name: 'id', description: 'ID của tour' })
  @ApiResponse({ status: 204, description: 'Tour đã được xóa' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy tour' })
  async remove(@Param('id') id: string) {
    await this.toursService.remove(id);
  }
}