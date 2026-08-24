import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
@Injectable()
export class AdminGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        // Kiểm tra query parameter ?admin=true
        // Nếu có admin=true -> cho phép truy cập
        // Nếu không -> từ chối (chuyển về trang lỗi)
        return request.query.admin === 'true';
    }
}