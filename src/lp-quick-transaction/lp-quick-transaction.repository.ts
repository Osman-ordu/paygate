import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LPQuickTransactionEntity } from './lp-quick-transaction.entity';

@Injectable()
export class LPQuickTransactionRepository {
  constructor(
    @InjectRepository(LPQuickTransactionEntity)
    private readonly repo: Repository<LPQuickTransactionEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) return;
    await this.repo.save([
      {
        senderLP: 'BinanceTR', senderLPCurrency: 'USDT',
        recipient: 'OKX', recipientCurrency: 'USDT',
        transferAmount: 5000, network: 'TRC20',
        walletAddress: 'TOKX001XYZCorporate', channel: 'Crypto',
        entityType: 'Individual', vaspName: 'OKX', coporateName: null,
        comment: 'Rebalancing', status: 'Completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        senderLP: 'OKX', senderLPCurrency: 'USDT',
        recipient: 'Whitebit', recipientCurrency: 'USDT',
        transferAmount: 2500, network: 'TRC20',
        walletAddress: 'TWB001XYZ789', channel: 'Crypto',
        entityType: 'Corporate', vaspName: 'Whitebit', coporateName: 'ABC Ltd.',
        comment: null, status: 'Pending',
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  async findAll(): Promise<LPQuickTransactionEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async add(data: Partial<LPQuickTransactionEntity>): Promise<LPQuickTransactionEntity> {
    const item = this.repo.create({
      ...data,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    });
    return this.repo.save(item);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
