import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, UseFilters, UseInterceptors, NotFoundException, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiBearerAuth } from "@nestjs/swagger";
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { PaginationInterceptor } from '../common/interceptors/pagination.interceptor';
import { Public, Roles } from '../auth/auth.decorators';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Bookings')
@Controller('api/bookings')
@UseFilters(HttpExceptionFilter)
export class BookingsApiController {
    constructor(private readonly bookingsService: BookingsService) { }

    // create
    @Post()
    @Public()
    @ApiOperation({ summary: 'Tạo booking mới' })
    @ApiBody({ type: CreateBookingDto })
    @ApiCreatedResponse({ description: 'Booking đã được tạo thành công' })
    @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
    create(@Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(createBookingDto);
    }

    @Get()
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Lấy danh sách bookings có phân trang' })
    @ApiOkResponse({ description: 'Danh sách bookings' })
    @UseInterceptors(PaginationInterceptor)
    @Roles('ADMIN')
    @UseGuards(AuthGuard)
    findAll(@Query() paginationDto: PaginationDto) {
        return this.bookingsService.findAll();
    }

    @Get(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Lấy chi tiết booking' })
    @ApiParam({ name: 'id', description: 'ID của booking' })
    @ApiOkResponse({ description: 'Chi tiết booking' })
    @ApiNotFoundResponse({ description: 'Không tìm thấy booking' })
    @Roles('ADMIN')
    @UseGuards(AuthGuard)
    async findOne(@Param('id') id: string) {
        const booking = await this.bookingsService.findOne(id);
        if (!booking) {
            throw new NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }

    @Patch(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Cập nhật booking' })
    @ApiParam({ name: 'id', description: 'ID của booking' })
    @ApiBody({ type: UpdateBookingDto })
    @ApiOkResponse({ description: 'Booking đã được cập nhật' })
    @ApiNotFoundResponse({ description: 'Không tìm thấy booking' })
    @Roles('ADMIN')
    @UseGuards(AuthGuard)
    update(
        @Param('id') id: string,
        @Body() updateBookingDto: UpdateBookingDto,
    ) {
        return this.bookingsService.update(id, updateBookingDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Xóa booking' })
    @ApiParam({ name: 'id', description: 'ID của booking' })
    @ApiResponse({ status: 204, description: 'Booking đã được xóa' })
    @ApiNotFoundResponse({ description: 'Không tìm thấy booking' })
    @Roles('ADMIN')
    @UseGuards(AuthGuard)
    remove(@Param('id') id: string) {
        return this.bookingsService.remove(id);
    }
}