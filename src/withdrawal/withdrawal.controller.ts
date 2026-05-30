import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { WithdrawalRepository } from './withdrawal.repository';

@Controller('api/Withdrawal')
export class WithdrawalController {
  constructor(private readonly repo: WithdrawalRepository) {}

  @Post('getList')
  async getList(@Body() body: any) {
    const take = body.take || 20;
    const page = body.page ?? 0;
    const filters = body.filter || [];
    const sort = body.sort || null;
    const { result, totalCount } = await this.repo.getList(take, page, filters, sort);
    return { data: { result, totalCount } };
  }

  @Get('log')
  async getLog(@Query('transactionId') transactionId: string) {
    return { data: await this.repo.getLog(transactionId) };
  }

  @Get('refund')
  async getRefunds(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return { data: await this.repo.getRefunds(startDate, endDate) };
  }

  @Get()
  async getAll() {
    return { data: await this.repo.getAll() };
  }
}
