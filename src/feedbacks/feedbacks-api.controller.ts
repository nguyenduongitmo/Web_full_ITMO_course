
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, UseFilters, UseInterceptors, NotFoundException  } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiConflictResponse } from "@nestjs/swagger";
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { PaginationInterceptor } from '../common/interceptors/pagination.interceptor';

@ApiTags('Feedbacks')
@Controller('api/feedbacks')
@UseFilters(HttpExceptionFilter)
export class FeedbacksApiController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo feedback mới' })
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbacksService.create(createFeedbackDto);
  }

@Get()
  @ApiOperation({ summary: 'Lấy danh sách feedbacks có phân trang' })
  @UseInterceptors(PaginationInterceptor)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.feedbacksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết feedback' })
  @ApiParam({ name: 'id', description: 'ID của feedback' })
  async findOne(@Param('id') id: string) {
    const feedback = await this.feedbacksService.findOne(id);
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return feedback;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật feedback' })
  @ApiParam({ name: 'id', description: 'ID của feedback' })
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbacksService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa feedback' })
  @ApiParam({ name: 'id', description: 'ID của feedback' })
  @ApiResponse({ status: 204, description: 'Feedback đã được xóa' })
  remove(@Param('id') id: string) {
    return this.feedbacksService.remove(id);
  }
}