import { Controller, Get, Post, Put, Body, Query } from '@nestjs/common';
import { DepositRepository } from './deposit.repository';

@Controller('api/Deposit')
export class DepositController {
  constructor(private readonly repo: DepositRepository) {}

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
  async getLog(@Query('DepositId') depositId: string) {
    return { data: await this.repo.getLog(depositId) };
  }

  @Post('updateStatus')
  async updateStatus(@Body() body: any) {
    const ok = await this.repo.updateStatus(
      body.depositId,
      body.transactionStatus,
      body.refundStatus ?? null,
      body.comment ?? null,
    );
    return { success: ok, data: null };
  }

  @Put('refund/')
  async refund(@Query('id') id: string) {
    const ok = await this.repo.refund(id);
    return { success: ok, data: null };
  }

  @Post('reject/')
  async reject(@Query('id') id: string) {
    const ok = await this.repo.reject(id);
    return { success: ok, data: null };
  }

  @Put('confirm/')
  async confirm(@Query('id') id: string) {
    const ok = await this.repo.confirm(id);
    return { success: ok, data: null };
  }

  @Put('changemasakresult/')
  async changeMasakResult(@Query('id') id: string, @Body() body: any) {
    const ok = await this.repo.changeMasakResult(id, body.masakResult || body.result || '');
    return { success: ok, data: null };
  }

  @Post('export')
  async export(@Body() body: any) {
    const filters = body.filter || [];
    const sort = body.sort || null;
    return { data: await this.repo.exportAll(filters, sort) };
  }
}
