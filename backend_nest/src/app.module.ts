import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { HealthModule } from './health/health.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { AuthModule } from './user-management/auth/auth.module';
import { TwoFaModule } from './user-management/two-fa/two-fa.module';
import { GoogleModule } from './user-management/google/google.module';
import { ProductsModule } from './products/products.module';
import { ServicesModule } from './services/services.module';
import { CompanyInfoModule } from './company-info/company-info.module';
import { JobsModule } from './jobs/jobs.module';
import { WebsiteStylesModule } from './website-styles/website-styles.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    InfrastructureModule,
    AuthModule,
    TwoFaModule,
    GoogleModule,
    ProductsModule,
    ServicesModule,
    CompanyInfoModule,
    JobsModule,
    WebsiteStylesModule,
    AnalyticsModule,
    UploadsModule,
    HealthModule,
  ],
})
export class AppModule {}
