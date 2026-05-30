import { Controller, Get } from '@nestjs/common';
import { CompanyBankRepository } from './company-bank.repository';

@Controller('api/CompanyBank')
export class CompanyBankController {
  constructor(private readonly repo: CompanyBankRepository) {}

  @Get()
  async findAll() {
    return { data: await this.repo.findAll() };
  }
}
