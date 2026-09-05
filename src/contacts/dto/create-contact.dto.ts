import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsBoolean, IsNotEmpty, IsOptional, } from 'class-validator';
export class CreateContactDto {
  @ApiProperty({
    description: 'Họ và tên',
    example: 'Lê Thị C',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string ="";

  @ApiProperty({
    description: 'Email',
    example: 'lethic@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string ="";

  @ApiProperty({
    description: 'Số điện thoại',
    example: '+84987654321',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Loại hình du lịch quan tâm',
    example: 'Tour khám phá thành phố',
    required: false,
  })
  @IsString()
  @IsOptional()
  interest?: string;

  @ApiProperty({
    description: 'Điểm đến mong muốn',
    example: 'Moscow, Saint Petersburg',
    required: false,
  })
  @IsString()
  @IsOptional()
  destination?: string;

  @ApiProperty({
    description: 'Ngân sách (RUB)',
    example: '50000-100000',
    required: false,
  })
  @IsString()
  @IsOptional()
  budget?: string;

  @ApiProperty({
    description: 'Thời gian dự kiến',
    example: 'Tháng 6 năm 2025',
    required: false,
  })
  @IsString()
  @IsOptional()
  travelDate?: string;

  @ApiProperty({
    description: 'Nội dung tin nhắn',
    example: 'Tôi muốn tìm hiểu về tour Moscow...',
  })
  @IsString()
  @IsNotEmpty()
  message: string ="";

  @ApiProperty({
    description: 'Đăng ký nhận bản tin',
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  subscribe?: boolean;
}