import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EODBalanceEntity } from './eod-balance.entity';

const SYMBOLS = ['BTC', 'ETH', 'USDT', 'TRX', 'BNB'];

@Injectable()
export class EODBalanceRepository {
  constructor(
    @InjectRepository(EODBalanceEntity)
    private readonly repo: Repository<EODBalanceEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) return;
    const seeds = SYMBOLS.map((symbol, i) => ({
      symbol,
      client: Math.round(Math.random() * 100000) / 100,
      clientUSDT: Math.round(Math.random() * 500000) / 100,
      custody: Math.round(Math.random() * 80000) / 100,
      custodyUSDT: Math.round(Math.random() * 400000) / 100,
      lp: Math.round(Math.random() * 120000) / 100,
      lpusdt: Math.round(Math.random() * 600000) / 100,
      bank: Math.round(Math.random() * 200000) / 100,
      bankUSDT: Math.round(Math.random() * 1000000) / 100,
      company: Math.round(Math.random() * 50000) / 100,
      companyUSDT: Math.round(Math.random() * 250000) / 100,
      clientvsCompany: Math.round((Math.random() * 10000 - 5000) * 100) / 100,
      dcr: Math.round((Math.random() * 0.1 + 0.95) * 10000) / 10000,
      lastUpdatedAt: new Date(Date.now() - i * 3600000).toISOString(),
      lastUpdatedBy: 'admin@admin.com',
    }));
    await this.repo.save(seeds);
  }

  async findByDate(_date: string): Promise<EODBalanceEntity[]> {
    return this.repo.find();
  }

  async update(data: Partial<EODBalanceEntity> & { id?: string; symbol?: string }): Promise<boolean> {
    const { lastUpdatedAt: _, ...rest } = data as any;
    const update = { ...rest, lastUpdatedAt: new Date().toISOString() };
    if (data.id) {
      const result = await this.repo.update(data.id, update);
      return (result.affected ?? 0) > 0;
    }
    if (data.symbol) {
      const record = await this.repo.findOne({ where: { symbol: data.symbol } });
      if (!record) return false;
      await this.repo.update(record.id, update);
      return true;
    }
    return false;
  }
}
