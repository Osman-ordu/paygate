import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LPTransactionEntity } from './lp-transaction.entity';

const BALANCE_DATA = {
  balances: [
    {
      lpName: 'BinanceTR', totalBalance: 150000, availableBalance: 140000,
      data: [
        { accountName: 'Spot',    subBalance: 100000, subAvailable: 92000, coins: [{ currency: 'USDT', quantity: 80000, balance: 80000, available: 75000 }, { currency: 'BTC', quantity: 0.5, balance: 20000, available: 17000 }] },
        { accountName: 'Funding', subBalance: 50000,  subAvailable: 48000, coins: [{ currency: 'USDT', quantity: 50000, balance: 50000, available: 48000 }] },
      ],
    },
    {
      lpName: 'OKX', totalBalance: 95000, availableBalance: 90000,
      data: [
        { accountName: 'Trading', subBalance: 60000, subAvailable: 57000, coins: [{ currency: 'USDT', quantity: 45000, balance: 45000, available: 43000 }, { currency: 'ETH', quantity: 5, balance: 15000, available: 14000 }] },
        { accountName: 'Funding', subBalance: 35000, subAvailable: 33000, coins: [{ currency: 'USDT', quantity: 35000, balance: 35000, available: 33000 }] },
      ],
    },
    {
      lpName: 'Whitebit', totalBalance: 75000, availableBalance: 72000,
      data: [
        { accountName: 'Main', subBalance: 75000, subAvailable: 72000, coins: [{ currency: 'USDT', quantity: 70000, balance: 70000, available: 67000 }, { currency: 'TRX', quantity: 50000, balance: 5000, available: 5000 }] },
      ],
    },
    {
      lpName: 'CoinTr', totalBalance: 30000, availableBalance: 28000,
      data: [
        { accountName: 'CoinTrMain', subBalance: 30000, subAvailable: 28000, coins: [{ currency: 'USDT', quantity: 30000, balance: 30000, available: 28000 }] },
      ],
    },
  ],
  totalBalance: { balance: 350000, availableBalance: 330000 },
};

const LP_BALANCE_FLAT = [
  { lpName: 'BinanceTR', currency: 'USDT', balance: 150000, avaiableBalance: 140000 },
  { lpName: 'OKX',       currency: 'USDT', balance: 95000,  avaiableBalance: 90000  },
  { lpName: 'Whitebit',  currency: 'USDT', balance: 75000,  avaiableBalance: 72000  },
  { lpName: 'CoinTr',    currency: 'USDT', balance: 30000,  avaiableBalance: 28000  },
];

@Injectable()
export class LPTransactionRepository {
  constructor(
    @InjectRepository(LPTransactionEntity)
    private readonly repo: Repository<LPTransactionEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) return;
    await this.repo.save([{
      senderLP: 'BinanceTR', recipient: 'OKX', currency: 'USDT', network: 'TRC20',
      walletAddress: 'TOKX001XYZ456', amount: 10000, fee: 1,
      txid: 'txid001ABC', status: 'Completed',
      createTimePH: new Date(Date.now() - 86400000).toISOString(),
      createTimeLP:  new Date(Date.now() - 86300000).toISOString(),
      transactionHash: '0xhash001', lpId: 'seed-lp-001', comment: 'Rebalancing',
    }]);
  }

  getBalances() {
    return BALANCE_DATA;
  }

  getBalanceList() {
    return LP_BALANCE_FLAT;
  }

  async getTransactions(startTime: string, endTime: string): Promise<LPTransactionEntity[]> {
    const start = new Date(startTime).getTime();
    const end   = new Date(endTime).getTime();
    const all   = await this.repo.find();
    return all.filter((t) => {
      const ts = new Date(t.createTimePH).getTime();
      return ts >= start && ts <= end;
    });
  }

  async addTransaction(data: Partial<LPTransactionEntity>): Promise<LPTransactionEntity> {
    const tx = this.repo.create({
      ...data,
      txid:            `txid${Date.now()}`,
      transactionHash: `0xhash${Date.now()}`,
      createTimePH:    new Date().toISOString(),
      createTimeLP:    new Date().toISOString(),
    });
    return this.repo.save(tx);
  }

  getCurrencies(_lpNameId: number): string[] {
    return ['USDT', 'BTC', 'ETH', 'TRX'];
  }

  getNetworks(_lpNameId: number, currencyName: string): string[] {
    const networks: Record<string, string[]> = {
      USDT: ['TRC20', 'ERC20', 'BEP20'],
      BTC:  ['BTC'],
      ETH:  ['ERC20'],
      TRX:  ['TRC20'],
    };
    return networks[currencyName] || [];
  }
}
