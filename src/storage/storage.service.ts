import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Multer } from 'multer';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;

  constructor() {
    // Lấy config từ biến môi trường
    this.bucket = process.env.S3_BUCKET || '';

    // Tạo client kết nối tới Cloudflare R2
    this.s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT || '',
      region: 'auto',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
    });
  }

  /**
   * Upload file lên Cloudflare R2
   * @param file - File từ request (Express.Multer.File)
   * @param folder - Thư mục lưu (mặc định: 'tours')
   * @returns { url, key } - URL để truy cập và key để xóa sau
   */
  async uploadFile(file: Express.Multer.File, folder: string = 'tours') {
    // Kiểm tra file hợp lệ
    this.validateFile(file);

    // Tạo tên file duy nhất (tránh trùng lặp)
    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;
    const key = `${folder}/${fileName}`; // Ví dụ: tours/abc123.jpg

    // Tạo lệnh upload
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    // Thực hiện upload
    await this.s3Client.send(command);

    // Tạo URL để truy cập file
    const endpoint = process.env.S3_ENDPOINT || '';
    const url = `https://${this.bucket}.${endpoint.replace('https://', '')}/${key}`;

    return { url, key };
  }

  /// Xóa file khỏi Cloudflare R2: @param key - Key của file cần xóa (ví dụ: tours/abc123.jpg)
  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    await this.s3Client.send(command);
  }

  // Kiểm tra file hợp lệ: kích thước và loại file
  private validateFile(file: Express.Multer.File) {
    // Giới hạn kích thước: 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(`File quá lớn. Chỉ chấp nhận file dưới 5MB.`);
    }

    // Chỉ cho phép ảnh
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Loại file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`
      );
    }
  }
}