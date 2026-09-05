import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, UseFilters, UseInterceptors, NotFoundException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiConflictResponse } from "@nestjs/swagger";
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { PaginationInterceptor } from '../common/interceptors/pagination.interceptor';

@ApiTags('Bookings')
@Controller('api/bookings')
@UseFilters(HttpExceptionFilter)
export class BookingsApiController {
    constructor(private readonly bookingsService: BookingsService) { }

    // create
    @Post()
    @ApiOperation({ summary: 'Tạo booking mới' })
    @ApiBody({ type: CreateBookingDto })
    @ApiCreatedResponse({ description: 'Booking đã được tạo thành công' })
    @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
    create(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(createBookingDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách bookings có phân trang' })
    @ApiOkResponse({ description: 'Danh sách bookings' })
    @UseInterceptors(PaginationInterceptor)
    findAll(@Query() paginationDto: PaginationDto) {
        return this.bookingsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Lấy chi tiết booking' })
    @ApiParam({ name: 'id', description: 'ID của booking' })
    @ApiOkResponse({ description: 'Chi tiết booking' })
    @ApiNotFoundResponse({ description: 'Không tìm thấy booking' })
    async findOne(@Param('id') id: string) {
        const booking = await this.bookingsService.findOne(id);
        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Cập nhật booking' })
    @ApiParam({ name: 'id', description: 'ID của booking' })
    @ApiBody({ type: UpdateBookingDto })
    @ApiOkResponse({ description: 'Booking đã được cập nhật' })
    @ApiNotFoundResponse({ description: 'Không tìm thấy booking' })
    update(
        @Param('id') id: string,
        @Body() updateBookingDto: UpdateBookingDto,
    ) {
        return this.bookingsService.update(id, updateBookingDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Xóa booking' })
    @ApiParam({ name: 'id', description: 'ID của booking' })
    @ApiResponse({ status: 204, description: 'Booking đã được xóa' })
    @ApiNotFoundResponse({ description: 'Không tìm thấy booking' })
    remove(@Param('id') id: string) {
        return this.bookingsService.remove(id);
    }
}