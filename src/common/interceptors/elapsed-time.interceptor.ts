import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map, tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const start = Date.now();

        // Xử lý grapql (không có request method)
        const contextType = context.getType() as string;
        if (contextType === 'graphql') {
            return next.handle().pipe(
                tap(() => {
                    const elapsed = Date.now() - start;
                    console.log(`[GraphQL] - ${elapsed}ms`);
                }),
                // Không sửa data của GraphQL
            );
        }

        // xử lí http
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        // truy cập an toàn
         if (!request) {
            return next.handle();
        }

        const method = request.method || 'UNKNOWN';
        const url = request.url || '/';

        //Xử lý request và pipe qua các operators
        return next.handle().pipe(
            //tap: Chạy khi response được gửi đi (side effects
            tap(() => {
                const elapsed = Date.now() - start;
                // Log thời gian
                console.log(`[${method}] ${url} - ${elapsed}ms`);

                // Set header cho REST/GraphQL API
                if (response && response.setHeader) {
                    try {
                        response.setHeader('X-Elapsed-Time', `${elapsed}ms`);
                    } catch (e) {
                        // Bỏ qua nếu header đã được gửi
                    }
                }
            }),

            //  map: Biến đổi dữ liệu phản hồi
            map((data) => {
                const elapsed = Date.now() - start;
                 // Chỉ xử lý object không phải array
                if (!data || typeof data !== 'object' || Array.isArray(data)) {
                    return data;
                }

                // Kiểm tra HTML page (thay vì data.layout)
                const isHtmlPage =
                    'currentPath' in data ||
                    'showBanner' in data ||
                    'title' in data;

                if (isHtmlPage) {
                    return {
                        ...data,
                        serverTime: `${elapsed}ms`,
                        clientTime: '0ms',
                    };
                }

                // API response - không thêm serverTime
                return data;
            }),
        );
    }
}