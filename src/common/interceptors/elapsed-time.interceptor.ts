import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map, tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const start = Date.now();
        const method = request.method;
        const url = request.url;


        //Xử lý request và pipe qua các operators
        return next.handle().pipe(
            //tap: Chạy khi response được gửi đi (side effects
            tap(() => {
                const elapsed = Date.now() - start;
                // Log thời gian
                console.log(`[${method}] ${url} - ${elapsed}ms`);

                // Set header cho REST/GraphQL API
                response.setHeader('X-Elapsed-Time', `${elapsed}ms`);
            }),

            //  map: Biến đổi dữ liệu phản hồi
            map((data) => {
                const elapsed = Date.now() - start;
                // Nếu là render view (có data.layout)
                if (data && typeof data === 'object' && data.layout !== undefined) {
                    return {
                        ...data,
                        serverTime: `${elapsed}ms`,   // Thêm thời gian server
                        clientTime: '0ms',            // Client sẽ tính sau
                    };
                }
                // Nếu là API (JSON), vẫn thêm serverTime vào body
                if (data && typeof data === 'object') {
                    return {
                        ...data,
                        serverTime: `${elapsed}ms`,
                    };
                }

                //Trường hợp khác (file, stream), không thay đổi
                return data;
            }),
        );
    }
}