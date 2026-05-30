import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TreasuryTransferRepository } from './treasury-transfer.repository';

@Controller('api/TreasuryTransfer')
export class TreasuryTransferController {
  constructor(private readonly repo: TreasuryTransferRepository) {}

  @Get('banklist')
  async getBankList() {
    return { data: await this.repo.getBankList() };
  }

  @Get('accounts')
  async getAccounts() {
    return { data: await this.repo.getAccounts() };
  }

  @Get('sendemail')
  sendEmail(@Query('accountId') accountId: string) {
    this.repo.sendEmail(accountId);
    return { success: true, data: null };
  }

  @Post('add')
  async add(@Body() body: any) {
    const transfer = await this.repo.addTransfer(body);
    return { success: true, data: { id: transfer.id } };
  }

  @Post('addmanual')
  async addManual(@Body() body: any) {
    const transfer = await this.repo.addManualTransfer(body);
    return { success: true, data: { id: transfer.id } };
  }
}
