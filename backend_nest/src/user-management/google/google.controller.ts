import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { GoogleAuthenticateDto } from './dto/google-authenticate.dto';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
  constructor(private readonly google: GoogleService) {}

  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  authenticate(
    @Body() body: GoogleAuthenticateDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.google.authenticate(response, body);
  }
}
