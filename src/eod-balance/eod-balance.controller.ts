import { Controller, Get, Put, Body, Query } from '@nestjs/common';
import { EODBalanceRepository } from './eod-balance.repository';

@Controller('api/EODBalance')
export class EODBalanceController {
  constructor(private readonly repo: EODBalanceRepository) {}

  @Get()
  async findByDate(@Query('date') date: string) {
    const records = date ? await this.repo.findByDate(date) : [];
    return { data: records };
  }

  @Put()
  async update(@Body() body: any) {
    const ok = await this.repo.update(body);
    return { success: ok, data: null };
  }
}
