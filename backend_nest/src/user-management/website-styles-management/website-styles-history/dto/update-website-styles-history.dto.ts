import { PartialType } from '@nestjs/mapped-types';
import { CreateWebsiteStylesHistoryDto } from './create-website-styles-history.dto';

export class UpdateWebsiteStylesHistoryDto extends PartialType(CreateWebsiteStylesHistoryDto) {}
