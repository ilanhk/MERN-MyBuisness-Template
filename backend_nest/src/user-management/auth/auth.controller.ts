import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { RefreshTokenGuard } from './guards/cookie-token.guard';
import { UserDocument } from '../users/user.schema';

@Controller('users')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post()
  register(@Body() body: Record<string, unknown>, @Res({ passthrough: true }) response: Response) {
    return this.auth.register(response, body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: Record<string, unknown>, @Res({ passthrough: true }) response: Response) {
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
  resetPasswordWithRouteToken(@Param('resetToken') resetToken: string, @Body() body: Record<string, unknown>) {
    return this.auth.resetPassword(body, resetToken);
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refresh(@CurrentUser() user: UserDocument, @Res({ passthrough: true }) response: Response) {
    return this.auth.refresh(response, user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    return this.auth.logout(response, (request as Request & { user?: { _id: string } }).user?._id);
  }
}
