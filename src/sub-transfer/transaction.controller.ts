import { Controller, Get } from '@nestjs/common';
import { SubTransferRepository } from './sub-transfer.repository';

@Controller('api/Transaction')
export class TransactionController {
  constructor(private readonly repo: SubTransferRepository) {}

  @Get()
  async findAll() {
    return { data: await this.repo.findAllTransactions() };
  }
}
