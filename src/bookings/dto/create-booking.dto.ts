import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsInt, IsNotEmpty,IsUUID, IsOptional, Min, IsDateString,} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @ApiProperty({
    description: 'ID của tour',
    example: 'cm8f7g9p00003...',
  })
  @IsUUID()
  @IsNotEmpty()
  tourId: string ="";

  @ApiProperty({
    description: 'ID của người dùng',
    example: 'cm8f7g9p00004...',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string ="";

  @ApiProperty({
    description: 'Họ và tên',
    example: 'Nguyễn Văn A',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string ="";

  @ApiProperty({
    description: 'Email',
    example: 'nguyenvana@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string ="";

  @ApiProperty({
    description: 'Số điện thoại',
    example: '+84912345678',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Ngày khởi hành',
    example: '2025-06-15',
  })
  @IsDateString()
  @IsNotEmpty()
  travelDate: string ="";

  @ApiProperty({
    description: 'Số lượng khách',
    example: 2,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  passengers?: number;

  @ApiProperty({
    description: 'Trạng thái',
    example: 'PENDING',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    default: 'PENDING',
  })
  @IsString()
  @IsOptional()
  status?: string;
}