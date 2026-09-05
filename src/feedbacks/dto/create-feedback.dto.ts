import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsInt, IsNotEmpty, IsUUID, IsOptional, Min, Max,} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFeedbackDto {
  @ApiProperty({
    description: 'Họ và tên',
    example: 'Trần Văn B',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string ="";

  @ApiProperty({
    description: 'Email',
    example: 'tranb@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string ="";

  @ApiProperty({
    description: 'Đánh giá (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({
    description: 'Nhận xét',
    example: 'Tour rất tuyệt vời!',
  })
  @IsString()
  @IsNotEmpty()
  comment: string ="";

  @ApiProperty({
    description: 'ID của tour',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  tourId?: string;

  @ApiProperty({
    description: 'ID của người dùng',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string;
}