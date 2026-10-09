import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class ResetPasswordDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  resetToken?: string;

  @IsString()
  @MinLength(12)
  @MaxLength(128)
  newPassword!: string;
}
