import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from "@nestjs/core"; // đọc metadata
import { Response } from 'express';
import { CACHE_CONTROL_KEY } from '../decorators/cache-control.decorator';

@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
    //  Inject Reflector để đọc metadata từ decorator
    constructor(private reflector: Reflector) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // Đọc metadata từ decorator @CacheControl
        const cacheControl = this.reflector.get<{ maxAge: number; isPublic: boolean }>(
            CACHE_CONTROL_KEY,                    // Key của metadata
            context.getHandler(),                 // Lấy từ handler hiện tại
        );

        // Nếu không có decoảtỏ thì bỏ qua
        if (!cacheControl) {
            return next.handle();
        }

        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();

        // Xây dựng giá trị Cache-Control
        const { maxAge, isPublic } = cacheControl;
        const cacheControlValue = isPublic
            ? `public, max-age=${maxAge}`        // Public cache (CDN, browser)
            : `private, max-age=${maxAge}`;      // Private cache (browser only)

        // Set header
        response.setHeader('Cache-Control', cacheControlValue);

        return next.handle();
    }
}