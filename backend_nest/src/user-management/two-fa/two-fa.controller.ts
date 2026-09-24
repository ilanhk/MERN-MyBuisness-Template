import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/cookie-token.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from '../users/user.schema';
import { TwoFaService } from './two-fa.service';

@Controller('2fa')
@UseGuards(AccessTokenGuard)
export class TwoFaController {
  constructor(private readonly twoFa: TwoFaService) {}

  @Get('generate')
  generate(@CurrentUser() user: UserDocument) {
    return this.twoFa.generate(user);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verify(@Body() body: Record<string, unknown>) {
    return this.twoFa.verify(body.token, body.secret);
  }
}
