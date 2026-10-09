import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class GoogleAuthenticateDto {
  @IsString()
  @MinLength(1)
  credential!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  domainName?: string;
}
