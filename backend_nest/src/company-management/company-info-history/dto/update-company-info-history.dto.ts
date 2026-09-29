import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyInfoHistoryDto } from './create-company-info-history.dto';

export class UpdateCompanyInfoHistoryDto extends PartialType(CreateCompanyInfoHistoryDto) {}
