import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../common/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {   // <-- NAMED export
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    const role = String(user?.role ?? '').toLowerCase();
    return required.some(r => r.toLowerCase() === role);
  }
}

// (tuỳ chọn) export default cũng được, nhưng KHÔNG cần thiết
// export default RolesGuard;
