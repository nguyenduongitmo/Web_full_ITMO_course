import { Injectable, NestInterceptor,ExecutionContext,CallHandler,Logger,} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface PaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    links: {
        first: string | null;
        prev: string | null;
        next: string | null;
        last: string | null;
    };
}

@Injectable()
export class PaginationInterceptor<T> implements NestInterceptor {
    private readonly logger = new Logger(PaginationInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse<Response>();

        // Chỉ áp dụng cho GET requests có query params
        const isPaginatedRequest =
            request.method === 'GET' &&
            (request.query.page || request.query.limit);

        return next.handle().pipe(
            map((data) => {
                // Nếu không phải paginated request hoặc data không phải array
                if (!isPaginatedRequest || !Array.isArray(data)) {
                    return data;
                }

                const page = Number(request.query.page) || 1;
                const limit = Number(request.query.limit) || 10;
                const total = data.length;
                const totalPages = Math.ceil(total / limit);

                // Cắt dữ liệu theo trang
                const start = (page - 1) * limit;
                const end = Math.min(start + limit, total);
                const paginatedData = data.slice(start, end);

                // Xây dựng URL
                const baseUrl = this.buildBaseUrl(request);
                const buildUrl = (pageNum: number) => {
                    if (pageNum < 1 || pageNum > totalPages) return null;
                    return `${baseUrl}?page=${pageNum}&limit=${limit}`;
                };

            const result: PaginatedResult<T> = {
          data: paginatedData,
          meta: {
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
          links: {
            first: buildUrl(1),
            prev: buildUrl(page - 1),
            next: buildUrl(page + 1),
            last: buildUrl(totalPages),
          },
        };

        //  HATEOAS - Link Header 
        const linkParts: string[] = [];
        if (result.links.first) linkParts.push(`<${result.links.first}>; rel="first"`);
        if (result.links.prev) linkParts.push(`<${result.links.prev}>; rel="prev"`);
        if (result.links.next) linkParts.push(`<${result.links.next}>; rel="next"`);
        if (result.links.last) linkParts.push(`<${result.links.last}>; rel="last"`);

        if (linkParts.length > 0) {
          response.setHeader('Link', linkParts.join(', '));
        }

        //  Additional Headers 
        response.setHeader('X-Total-Count', total);
        response.setHeader('X-Total-Pages', totalPages);

        return result;
      }),
    );
  }
    
private buildBaseUrl(request: any): string {
    const protocol = request.protocol;
    const host = request.get('host');
    const originalUrl = request.originalUrl.split('?')[0];
    return `${protocol}://${host}${originalUrl}`;
  }
}