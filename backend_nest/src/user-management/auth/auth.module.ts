import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { CompaniesModule } from "../../company-management/companies/companies.module";
import { ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [
    UsersModule,
    CompaniesModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 30,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
