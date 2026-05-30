import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutoTransferEntity, AutoTransferTransactionEntity } from './auto-transfer.entity';

@Injectable()
export class AutoTransferRepository {
  constructor(
    @InjectRepository(AutoTransferEntity)
    private readonly ruleRepo: Repository<AutoTransferEntity>,
    @InjectRepository(AutoTransferTransactionEntity)
    private readonly logRepo: Repository<AutoTransferTransactionEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.ruleRepo.count();
    if (count > 0) return;
    await this.ruleRepo.save([
      { withdrawAccount: 'PSP Garanti Çekim Hesabı', depositAccount: 'PSP Ziraat Ödeme Hesabı',   maintenanceBalance: 50000, topUpBalance: 200000, prioritization: 1, status: 1 },
      { withdrawAccount: 'PSP Garanti Çekim Hesabı', depositAccount: 'PSP Vakıfbank Ödeme Hesabı', maintenanceBalance: 30000, topUpBalance: 100000, prioritization: 2, status: 0 },
    ]);
    await this.logRepo.save([
      { timestamp: new Date(Date.now() - 3600000).toISOString(), depositAccount: 'PSP Ziraat Ödeme Hesabı',   withdrawAccount: 'PSP Garanti Çekim Hesabı', amount: 200000, status: 'Success',  errorMessage: null },
      { timestamp: new Date(Date.now() - 7200000).toISOString(), depositAccount: 'PSP Vakıfbank Ödeme Hesabı', withdrawAccount: 'PSP Garanti Çekim Hesabı', amount: 100000, status: 'Failed',   errorMessage: 'Insufficient balance' },
    ]);
  }

  async findAll(): Promise<AutoTransferEntity[]> {
    return this.ruleRepo.find({ order: { prioritization: 'ASC' } });
  }

  async findById(id: string): Promise<AutoTransferEntity | null> {
    return this.ruleRepo.findOne({ where: { id } });
  }

  async create(data: Partial<AutoTransferEntity>): Promise<AutoTransferEntity> {
    const rule = this.ruleRepo.create({ status: 1, ...data });
    return this.ruleRepo.save(rule);
  }

  async update(id: string, data: Partial<AutoTransferEntity>): Promise<AutoTransferEntity | null> {
    await this.ruleRepo.update(id, data);
    return this.findById(id);
  }

  async toggleStatus(id: string): Promise<AutoTransferEntity | null> {
    const rule = await this.findById(id);
    if (!rule) return null;
    return this.update(id, { status: rule.status === 1 ? 0 : 1 });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.ruleRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async getLogs(): Promise<AutoTransferTransactionEntity[]> {
    return this.logRepo.find({ order: { timestamp: 'DESC' } });
  }
}
