import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';

// 1. @Public() bỏ qua ktra đăng nhập vì cần mark những route public như /tours, /contact
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);


// 2. @Roles() kiểm tra vai trò, yêu cầu quyền truy cập
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// 3. @CurrentUser() lấy người dùng từ yêu cầu 
export const CurrentUser = createParamDecorator(
    (data:string| undefined, ctx:ExecutionContext)=> {
        const user = ctx.switchToHttp().getRequest().user;
        // Nếu có data thì lấy field cụ thể, ví dụ @CurrentUser('email')
        return data? user?.[data]: user;
    }
)