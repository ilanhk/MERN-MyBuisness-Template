import { Injectable } from '@nestjs/common';
import { CreateCompanyInfoHistoryDto } from './dto/create-company-info-history.dto';
import { UpdateCompanyInfoHistoryDto } from './dto/update-company-info-history.dto';

@Injectable()
export class CompanyInfoHistoryService {
  create(createCompanyInfoHistoryDto: CreateCompanyInfoHistoryDto) {
    return 'This action adds a new companyInfoHistory';
  }

  findAll() {
    return `This action returns all companyInfoHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} companyInfoHistory`;
  }

  update(id: number, updateCompanyInfoHistoryDto: UpdateCompanyInfoHistoryDto) {
    return `This action updates a #${id} companyInfoHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} companyInfoHistory`;
  }
}
