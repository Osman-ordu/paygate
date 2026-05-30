import { Controller, Get, Query } from '@nestjs/common';
import { SubTransferRepository } from './sub-transfer.repository';

@Controller('api/SubTransfer')
export class SubTransferController {
  constructor(private readonly repo: SubTransferRepository) {}

  @Get('getall')
  async getAll() {
    return { data: await this.repo.findAllSubTransfers() };
  }

  @Get()
  async find(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
  ) {
    return { data: await this.repo.findSubTransfers(startDate, endDate, status) };
  }
}
