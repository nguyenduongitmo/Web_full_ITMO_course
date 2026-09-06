import { SetMetadata } from '@nestjs/common';
//  Export key để interceptor có thể đọc
export const CACHE_CONTROL_KEY = 'cacheControl';

// Tạo decorator
export const CacheControl = (maxAge: number, isPublic: boolean = true) =>
  SetMetadata(CACHE_CONTROL_KEY, { maxAge, isPublic });
// SetMetadata lưu metadata vào handler
//  Interceptor sẽ đọc metadata này
