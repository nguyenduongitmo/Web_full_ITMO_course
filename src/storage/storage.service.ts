import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Multer } from 'multer';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    console.log('S3 Config:');
    console.log('S3_BUCKET:', JSON.stringify(process.env.S3_BUCKET));
    console.log('S3_ENDPOINT:', JSON.stringify(process.env.S3_ENDPOINT));
    console.log('S3_ACCESS_KEY_ID:', process.env.S3_ACCESS_KEY_ID ? 'Found' : 'Not found');
    console.log('S3_SECRET_ACCESS_KEY:', process.env.S3_SECRET_ACCESS_KEY ? 'Found' : 'Not found');
    console.log('R2_PUBLIC_URL:', JSON.stringify(process.env.R2_PUBLIC_URL));
    // Lấy config từ biến môi trường, Trim để loại bỏ khoảng trắng thừa
    this.bucket = (process.env.S3_BUCKET || '').trim();
    this.publicUrl = (process.env.R2_PUBLIC_URL || '').trim();

    // Kiểm tra bucket có tồn tại không
    if (!this.bucket) {
      console.error('Lỗi: S3_BUCKET không được cấu hình trong .env');
    }
    // Tạo client kết nối tới Cloudflare R2
    this.s3Client = new S3Client({
      endpoint: (process.env.S3_ENDPOINT || '').trim(),
      region: 'auto',
      credentials: {
        accessKeyId: (process.env.S3_ACCESS_KEY_ID || '').trim(),
        secretAccessKey: (process.env.S3_SECRET_ACCESS_KEY || '').trim(),
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
    // Kiểm tra bucket trước khi upload
    if (!this.bucket) {
      throw new BadRequestException(
        'S3_BUCKET chưa được cấu hình. Vui lòng kiểm tra biến môi trường.'
      );
    }

    // Kiểm tra file hợp lệ
    this.validateFile(file);

    // Tạo tên file duy nhất (tránh trùng lặp)
    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;
    const key = `${folder}/${fileName}`; // Ví dụ: tours/abc123.jpg

    console.log('Uploading:', { bucket: this.bucket, key });

    // Tạo lệnh upload
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    // Thực hiện upload
    await this.s3Client.send(command);

     // Dùng R2_PUBLIC_URL
    const url = this.publicUrl
      ? `${this.publicUrl}/${key}`
      : `https://${this.bucket}.${(process.env.S3_ENDPOINT || '').replace('https://', '')}/${key}`;

    console.log('Uploaded:', url);
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