import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../../users/users.service';

type TokenKind = 'access' | 'refresh';

type AuthenticatedRequest = Request & { user?: Awaited<ReturnType<UsersService['findById']>> };

@Injectable()
export class CookieTokenGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly users: UsersService,
    private readonly kind: TokenKind,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const tokenName = this.config.get<string>(this.kind === 'access' ? 'ACCESS_TOKEN_NAME' : 'REFRESH_TOKEN_NAME');
    const token = tokenName ? request.cookies?.[tokenName] : undefined;

    if (!token) {
      throw new UnauthorizedException({
        message: this.kind === 'access' ? 'Access token missing' : 'No token provided',
      });
    }

    const secret = this.config.get<string>(this.kind === 'access' ? 'JWT_SECRET_ACCESS' : 'JWT_SECRET_REFRESH');
    if (!secret) {
      throw new Error(`JWT_SECRET_${this.kind.toUpperCase()} must be set before using authentication.`);
    }

    try {
      const payload = jwt.verify(token, secret) as jwt.JwtPayload;
      const userId = typeof payload.userId === 'string' ? payload.userId : undefined;
      const user = userId ? await this.users.findById(userId) : null;

      if (!user) {
        throw new UnauthorizedException({ message: 'User not found' });
      }

      request.user = user;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException({ message: 'Invalid or expired token' });
    }
  }
}

@Injectable()
export class AccessTokenGuard extends CookieTokenGuard {
  constructor(config: ConfigService, users: UsersService) {
    super(config, users, 'access');
  }
}

@Injectable()
export class RefreshTokenGuard extends CookieTokenGuard {
  constructor(config: ConfigService, users: UsersService) {
    super(config, users, 'refresh');
  }
}
