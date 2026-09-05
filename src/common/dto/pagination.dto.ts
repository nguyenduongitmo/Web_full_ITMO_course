import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class PaginationDto{
    @ApiPropertyOptional({
        description: 'Số trang (bắt đầu từ 1)',
        default:1,
        example:1,
    })
    @Type(() => Number) // Chuyển string "1" thành number 1
    @IsInt()
    @Min(1)
    @IsOptional()
    page?: number = 1;

    @ApiPropertyOptional({
        description: 'Số bản ghi mỗi trang (tối đa 100)',
        default: 10,
        example: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100) // Giới hạn Max để tránh DDoS
    @IsOptional()
    limit?: number = 10;

    @ApiPropertyOptional({
        description: 'Từ khóa tìm kiếm tour (tên, mô tả, mã tour, điểm đến)',
        example: 'Moscow',
    })
    @IsOptional()
    search?: string
}

