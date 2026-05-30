import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TreasuryAccountEntity } from './treasury-account.entity';
import { TreasuryTransferEntity } from './treasury-transfer.entity';

@Injectable()
export class TreasuryTransferRepository {
  constructor(
    @InjectRepository(TreasuryAccountEntity)
    private readonly accountRepo: Repository<TreasuryAccountEntity>,
    @InjectRepository(TreasuryTransferEntity)
    private readonly transferRepo: Repository<TreasuryTransferEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.accountRepo.count();
    if (count > 0) return;
    await this.accountRepo.save([
      { companyBankName: 'Ziraat Bankası', accountName: 'Ana Hazine Hesabı',   iban: 'TR330006100519786457841326', bankName: 'Ziraat Bankası', currency: 'TRY', balance: 1250000 },
      { companyBankName: 'Garanti BBVA',   accountName: 'Yedek Hazine Hesabı', iban: 'TR400006200096390075700001', bankName: 'Garanti BBVA',   currency: 'TRY', balance: 875000 },
    ]);
    await this.transferRepo.save([{
      fromAccountId: 1, toAccountId: 2, amount: 100000, currency: 'TRY',
      description: 'Hazine dengesi', isManual: false, status: 'Completed',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }]);
  }

  async getBankList(): Promise<TreasuryAccountEntity[]> {
    return this.accountRepo.find();
  }

  async getAccounts(): Promise<TreasuryAccountEntity[]> {
    return this.accountRepo.find();
  }

  sendEmail(_accountId: string): boolean {
    return true;
  }

  async addTransfer(data: any): Promise<TreasuryTransferEntity> {
    const transfer = this.transferRepo.create({
      fromAccountId: data.companyBankAccountId || data.fromAccountId,
      toAccountId:   data.recipientId || data.toAccountId,
      amount:        data.eachTransferAmount || data.amount,
      currency:      data.currency || 'TRY',
      description:   data.description || null,
      isManual:      false,
      status:        'Pending',
      createdAt:     new Date().toISOString(),
    });
    return this.transferRepo.save(transfer);
  }

  async addManualTransfer(data: any): Promise<TreasuryTransferEntity> {
    const transfer = this.transferRepo.create({
      fromAccountId: data.fromAccountId || 0,
      toAccountId:   data.toAccountId || 0,
      amount:        data.amount,
      currency:      data.currency || 'TRY',
      description:   data.description || null,
      isManual:      true,
      status:        'Completed',
      createdAt:     new Date().toISOString(),
    });
    return this.transferRepo.save(transfer);
  }
}
