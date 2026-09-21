import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, UseFilters, UseInterceptors, NotFoundException, UseGuards  } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiConflictResponse, ApiBearerAuth } from "@nestjs/swagger";
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { PaginationInterceptor } from '../common/interceptors/pagination.interceptor';
import { Public, Roles } from "../auth/auth.decorators";
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Contacts')
@Controller('api/contacts')
@UseFilters(HttpExceptionFilter)
export class ContactsApiController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Tạo contact mới' })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy danh sách contacts có phân trang' })
  @UseInterceptors(PaginationInterceptor)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.contactsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy chi tiết contact' })
  @ApiParam({ name: 'id', description: 'ID của contact' })
  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    const contact = await this.contactsService.findOne(id);
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật contact' })
  @ApiParam({ name: 'id', description: 'ID của contact' })
  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa contact' })
  @ApiParam({ name: 'id', description: 'ID của contact' })
  @ApiResponse({ status: 204, description: 'Contact đã được xóa' })
  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}