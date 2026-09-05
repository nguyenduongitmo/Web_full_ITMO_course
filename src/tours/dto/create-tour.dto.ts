import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsNotEmpty, IsUrl, Min,} from 'class-validator';

export class CreateTourDto {
  @ApiProperty({
    description: 'Tên tour',
    example: 'Tour khám phá Moscow',
  })
  @IsString()
  @IsNotEmpty()
  name: string = "";

  @ApiProperty({
    description: 'URL hình ảnh',
    example: 'https://example.com/moscow.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'Mô tả tour',
    example: 'Khám phá thủ đô Moscow...',
  })
  @IsString()
  @IsNotEmpty()
  description: string ="";

  @ApiProperty({
    description: 'Mã tour',
    example: '#ROYAL-01-VN-RU',
  })
  @IsString()
  @IsNotEmpty()
  code: string ="";

  @ApiProperty({
    description: 'Giá tour (RUB)',
    example: 55000,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Thời gian tour',
    example: '5 ngày 4 đêm',
    required: false,
  })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty({
    description: 'Tour nổi bật',
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}