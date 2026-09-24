import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY, UserRole } from '../decorators/roles.decorator';
import { UserDocument } from '../../users/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user?: UserDocument }>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException({ message: 'Not authorized' });
    }

    const roleMatches = requiredRoles.some((role) => {
      if (role === 'employee') return user.isEmployee;
      if (role === 'admin') return user.isAdmin;
      return user.isSuperAdmin;
    });

    if (!roleMatches) {
      throw new UnauthorizedException({ message: `Not authorized as ${requiredRoles.join(' or ')}` });
    }

    return true;
  }
}
