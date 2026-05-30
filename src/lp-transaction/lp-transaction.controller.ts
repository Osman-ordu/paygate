import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { LPTransactionRepository } from './lp-transaction.repository';

@Controller('api/LPTransaction')
export class LPTransactionController {
  constructor(private readonly repo: LPTransactionRepository) {}

  @Get('balance')
  getBalances() {
    return { data: this.repo.getBalances() };
  }

  @Get('lpbalance')
  getLpBalance() {
    return { data: this.repo.getBalanceList() };
  }

  @Get()
  async getTransactions(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    const data = await this.repo.getTransactions(
      startTime || new Date(0).toISOString(),
      endTime   || new Date().toISOString(),
    );
    return { data };
  }

  @Post('currencies')
  getCurrencies(@Body() body: { lpNameId: number }) {
    return { data: this.repo.getCurrencies(body.lpNameId) };
  }

  @Post('networks')
  getNetworks(@Body() body: { lpNameId: number; currencyName: string }) {
    return { data: this.repo.getNetworks(body.lpNameId, body.currencyName) };
  }

  @Post()
  async addTransaction(@Body() body: any) {
    const tx = await this.repo.addTransaction(body);
    return { success: true, data: { id: tx.id } };
  }
}
