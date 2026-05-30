import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LPAccountEntity, LPAccountWalletEntity } from './lp-account.entity';

@Injectable()
export class LPAccountRepository {
  constructor(
    @InjectRepository(LPAccountEntity)
    private readonly accountRepo: Repository<LPAccountEntity>,
    @InjectRepository(LPAccountWalletEntity)
    private readonly walletRepo: Repository<LPAccountWalletEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.accountRepo.count();
    if (count > 0) return;

    const accounts = await this.accountRepo.save([
      { lpName: 'BinanceTR', accountCurrency: 'USDT', accountStatus: 'Active' },
      { lpName: 'OKX',       accountCurrency: 'USDT', accountStatus: 'Active' },
      { lpName: 'Whitebit',  accountCurrency: 'USDT', accountStatus: 'Active' },
      { lpName: 'CoinTR',    accountCurrency: 'USDT', accountStatus: 'Inactive' },
    ]);

    const binance = accounts.find((a) => a.lpName === 'BinanceTR')!;
    const okx     = accounts.find((a) => a.lpName === 'OKX')!;
    const wb      = accounts.find((a) => a.lpName === 'Whitebit')!;

    await this.walletRepo.save([
      { lpNameId: binance.id, currencyNetwork: 'USDT-TRC20', accountId: 'TBinanceTR001XYZ123' },
      { lpNameId: binance.id, currencyNetwork: 'USDT-ERC20', accountId: '0xBinanceTR001ABC' },
      { lpNameId: okx.id,     currencyNetwork: 'USDT-TRC20', accountId: 'TOKX001XYZ456' },
      { lpNameId: wb.id,      currencyNetwork: 'USDT-TRC20', accountId: 'TWB001XYZ789' },
    ]);
  }

  async findAll(): Promise<LPAccountEntity[]> {
    return this.accountRepo.find();
  }

  async findWallets(lpNameId: string, _accountCurrency: string): Promise<LPAccountWalletEntity[]> {
    return this.walletRepo.find({ where: { lpNameId } });
  }
}
