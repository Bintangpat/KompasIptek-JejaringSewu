import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException({
        errorCode: 'ERR_FORBIDDEN_ROLE_ACCESS',
        message: 'Akses ditolak: Identitas pengguna tidak ditemukan.',
      });
    }

    const hasRole = requiredRoles.includes(user.role as Role);

    if (!hasRole) {
      throw new ForbiddenException({
        errorCode: 'ERR_FORBIDDEN_ROLE_ACCESS',
        message: `Akses ditolak: Peran '${user.role}' tidak memiliki izin untuk mengakses sumber daya ini.`,
      });
    }

    return true;
  }
}
