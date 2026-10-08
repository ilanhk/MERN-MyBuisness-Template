import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, timingSafeEqual } from 'crypto';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppUser } from '../../users/user.entity';
import { UsersService } from '../../users/users.service';

type TokenKind = 'access' | 'refresh';

type AuthenticatedRequest = Request & {
  user?: AppUser;
  refreshToken?: string;
};

@Injectable()
export class CookieTokenGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly users: UsersService,
    private readonly kind: TokenKind,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    const tokenName = this.config.get<string>(
      this.kind === 'access' ? 'ACCESS_TOKEN_NAME' : 'REFRESH_TOKEN_NAME',
    );
    const token = tokenName ? request.cookies?.[tokenName] : undefined;

    if (typeof token !== 'string' || !token) {
      throw new UnauthorizedException(
        this.kind === 'access'
          ? 'Access token missing'
          : 'Refresh token missing',
      );
    }

    const secretName =
      this.kind === 'access' ? 'JWT_SECRET_ACCESS' : 'JWT_SECRET_REFRESH';

    const secret = this.config.get<string>(secretName);

    if (!secret) {
      throw new Error(`${secretName} must be set before using authentication.`);
    }

    let payload: jwt.JwtPayload;

    try {
      const verified = jwt.verify(token, secret, {
        algorithms: ['HS256'],
        issuer: 'mybusiness-api',
        audience: 'mybusiness-web',
      });

      if (typeof verified === 'string') {
        throw new UnauthorizedException('Invalid token payload');
      }

      payload = verified;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      throw error;
    }

    const userId = typeof payload.sub === 'string' ? payload.sub : undefined;

    if (!userId) {
      throw new UnauthorizedException('Invalid token subject');
    }

    if (payload.tokenType !== this.kind) {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.users.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    if (
      typeof payload.tokenVersion !== 'number' ||
      payload.tokenVersion !== user.tokenVersion
    ) {
      throw new UnauthorizedException('Token has been revoked');
    }

    if (this.kind === 'refresh') {
      this.assertRefreshTokenIsCurrent(token, user);

      request.refreshToken = token;
    }

    request.user = user;
    return true;
  }

  private assertRefreshTokenIsCurrent(
    token: string,
    user: AppUser,
  ): void {
    if (!user.refreshTokenHash || !user.refreshTokenExpiresAt) {
      throw new UnauthorizedException('Refresh session is invalid');
    }

    if (user.refreshTokenExpiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Refresh session has expired');
    }

    const presentedHash = createHash('sha256')
      .update(token)
      .digest('hex');

    const expectedHash = Buffer.from(user.refreshTokenHash, 'utf8');
    const actualHash = Buffer.from(presentedHash, 'utf8');

    if (
      expectedHash.length !== actualHash.length ||
      !timingSafeEqual(expectedHash, actualHash)
    ) {
      throw new UnauthorizedException('Invalid refresh token');
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