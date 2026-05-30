import { Controller, Get, Query } from '@nestjs/common';
import { LPAccountRepository } from './lp-account.repository';

@Controller('api/LPAccount')
export class LPAccountController {
  constructor(private readonly repo: LPAccountRepository) {}

  @Get()
  async findAll() {
    return { data: await this.repo.findAll() };
  }

  @Get('wallets')
  async getWallets(
    @Query('lpNameId') lpNameId: string,
    @Query('accountCurrency') accountCurrency: string,
  ) {
    return { data: await this.repo.findWallets(lpNameId, accountCurrency) };
  }
}
