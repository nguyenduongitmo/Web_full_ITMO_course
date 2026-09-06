import { Controller, Post, Delete, UseGuards, UploadedFile, Body, Param, BadRequestException, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('storage')
@Controller('api/upload')
export class StorageController {
    constructor(private readonly storageService: StorageService) { }

    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload ảnh lên S3 storage' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
                folder: { type: 'string', default: 'tours' },
            },
        },
    })
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Body('folder') folder: string = 'tours',
    ) {
        if (!file) {
            throw new BadRequestException('Vui lòng chọn file để upload');
        }

        try {
            const result = await this.storageService.uploadFile(file, folder);
            return {
                success: true,
                url: result.url,
                key: result.key,
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Lỗi không xác định';
            throw new BadRequestException(`Upload thất bại: ${message}`);
        }
    }

    @Delete(':key')
    @ApiOperation({ summary: 'Xóa file khỏi storage' })
    async deleteFile(@Param('key') key: string) {
        await this.storageService.deleteFile(key);
        return { success: true };
    }
}


