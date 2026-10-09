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
} from "@nestjs/common";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { Request, Response } from "express";
import { AppUser } from "../users/user.entity";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import {
  AccessTokenGuard,
  RefreshTokenGuard,
} from "./guards/cookie-token.guard";

@Controller("users")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.auth.register(response, body);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.auth.login(response, body);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.auth.forgotPassword(body);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.auth.resetPassword(body);
  }

  @Post("reset-password/:resetToken")
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  resetPasswordWithRouteToken(
    @Param("resetToken") resetToken: string,
    @Body() body: ResetPasswordDto,
  ) {
    return this.auth.resetPassword(body, resetToken);
  }

  @Post("refresh")
  @UseGuards(ThrottlerGuard, RefreshTokenGuard)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  refresh(
    @CurrentUser() user: AppUser,
    @Req() request: Request & { refreshToken?: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!request.refreshToken) {
      throw new UnauthorizedException("Refresh token missing");
    }

    return this.auth.refresh(response, user, request.refreshToken);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  logout(
    @CurrentUser() user: AppUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.auth.logout(response, user.id);
  }
}
