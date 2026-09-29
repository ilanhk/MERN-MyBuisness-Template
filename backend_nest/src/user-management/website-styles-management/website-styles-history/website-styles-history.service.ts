import { Injectable } from '@nestjs/common';
import { CreateWebsiteStylesHistoryDto } from './dto/create-website-styles-history.dto';
import { UpdateWebsiteStylesHistoryDto } from './dto/update-website-styles-history.dto';

@Injectable()
export class WebsiteStylesHistoryService {
  create(createWebsiteStylesHistoryDto: CreateWebsiteStylesHistoryDto) {
    return 'This action adds a new websiteStylesHistory';
  }

  findAll() {
    return `This action returns all websiteStylesHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} websiteStylesHistory`;
  }

  update(id: number, updateWebsiteStylesHistoryDto: UpdateWebsiteStylesHistoryDto) {
    return `This action updates a #${id} websiteStylesHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} websiteStylesHistory`;
  }
}
