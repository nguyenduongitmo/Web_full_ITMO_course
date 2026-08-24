import { PartialType } from '@nestjs/mapped-types';
import { CreateTourDto } from './create-tour.dto';

// PartialType = tất cả field trở thành optional, không cần khởi tạo
// KHi update, không cần gửi đầy đủ tất cả field

export class UpdateTourDto extends PartialType(CreateTourDto){}
