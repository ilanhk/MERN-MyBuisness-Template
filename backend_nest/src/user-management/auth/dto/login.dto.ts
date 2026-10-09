import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MaxLength(128)
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  twoFaCode?: string;
}
