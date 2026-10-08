import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppUser } from '../users/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AccessTokenGuard, RefreshTokenGuard } from './guards/cookie-token.guard';

@Controller('users')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post()
  register(
    @Body() body: Record<string, unknown>,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.auth.register(response, body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() body: Record<string, unknown>,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.auth.login(response, body);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() body: Record<string, unknown>) {
    return this.auth.forgotPassword(body);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() body: Record<string, unknown>) {
    return this.auth.resetPassword(body);
  }

  @Post('reset-password/:resetToken')
  @HttpCode(HttpStatus.OK)
  resetPasswordWithRouteToken(
    @Param('resetToken') resetToken: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.auth.resetPassword(body, resetToken);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  refresh(
    @CurrentUser() user: AppUser,
    @Req() request: Request & { refreshToken?: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!request.refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    return this.auth.refresh(response, user, request.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  logout(
    @CurrentUser() user: AppUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.auth.logout(response, user.id);
  }
}
