import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger, } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import * as crypto from 'crypto'; // Để tạo hash

@Injectable()
export class ETagInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        // chỉ áp dụng cho GET request
        if (request.method !== 'GET') {
            return next.handle();  // Bỏ qua nếu không phải GET
        }

        return next.handle().pipe(
            map((data) => {
                //  Tạo ETag từ dữ liệu (MD5 hash)
                const dataString = JSON.stringify(data);
                const etag = crypto
                    .createHash('md5')      // Dùng thuật toán MD5
                    .update(dataString)     // Hash dữ liệu
                    .digest('hex');         // Chuyển sang hex string

                // Thêm ETag vào header response
                response.setHeader('ETag', `"${etag}"`);

                // Kiểm tra client đã có ETag này chưa
                const ifNoneMatch = request.headers['if-none-match'];

                // Nếu ETag giống nhau → content không đổi
                if (ifNoneMatch === `"${etag}"`) {
                    response.status(304);    // Not Modified
                    return null;            // Không gửi data
                }

                // Content đã thay đổi → gửi data mới
                return data;
            }),
        );
    }

}
