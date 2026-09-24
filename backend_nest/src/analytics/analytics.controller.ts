import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../user-management/auth/guards/cookie-token.guard';
import { Roles } from '../user-management/auth/decorators/roles.decorator';
import { RolesGuard } from '../user-management/auth/guards/roles.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(AccessTokenGuard, RolesGuard)
@Roles('employee')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Post('product')
  @HttpCode(HttpStatus.CREATED)
  addProductClick(@Body() body: Record<string, unknown>) {
    return this.analytics.addProductClick(body);
  }

  @Post('traffic')
  @HttpCode(HttpStatus.CREATED)
  addWebTraffic(@Body() body: Record<string, unknown>) {
    return this.analytics.addWebTraffic(body);
  }
}
