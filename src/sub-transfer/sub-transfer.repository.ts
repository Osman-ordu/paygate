import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubTransferEntity, TransactionEntity } from './sub-transfer.entity';

const BANKS = ['Ziraat Bankası', 'Garanti BBVA', 'Akbank', 'İş Bankası', 'Vakıfbank'];
const IBANS = ['TR330006100519786457841326', 'TR400006200096390075700001', 'TR320001500158007292515668'];
const STATUSES = ['Completed', 'Pending', 'Failed', 'Processing'];
const NAMES = ['Ali Veli', 'Ahmet Kaya', 'Fatma Demir', 'Mehmet Şahin'];
const TRANSFER_TYPES = ['EFT', 'Havale', 'FAST'];

@Injectable()
export class SubTransferRepository {
  constructor(
    @InjectRepository(SubTransferEntity)
    private readonly subRepo: Repository<SubTransferEntity>,
    @InjectRepository(TransactionEntity)
    private readonly txRepo: Repository<TransactionEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.subRepo.count();
    if (count > 0) return;

    const subSeeds = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(Date.now() - i * 86400000 - Math.random() * 86400000).toISOString();
      return {
        bankName: BANKS[i % BANKS.length],
        stTransferDate: date,
        stTransactionNo: `ST-${String(i + 1).padStart(6, '0')}`,
        stAmount: Math.round((Math.random() * 50000 + 1000) * 100) / 100,
        stTransferStatus: STATUSES[i % STATUSES.length],
        stTransactionDescription: i % 3 === 0 ? 'Hazine dengesi' : null,
        ttId: `TT-${String(i + 1).padStart(6, '0')}`,
        ttTransferDate: new Date(new Date(date).getTime() + 3600000).toISOString(),
        ttComment: i % 4 === 0 ? 'Onaylandı' : null,
        ttBankName: BANKS[(i + 1) % BANKS.length],
        ttIban: IBANS[i % IBANS.length],
        ttFullName: NAMES[i % NAMES.length],
        ttStatus: STATUSES[(i + 1) % STATUSES.length],
        updateDate: new Date(Date.now() - i * 3600000).toISOString(),
        transferredBy: 'admin@admin.com',
        transferType: TRANSFER_TYPES[i % TRANSFER_TYPES.length],
      };
    });
    await this.subRepo.save(subSeeds);

    await this.txRepo.save([
      { type: 'Deposit',    amount: 10000, currency: 'TRY', fromAccount: 'Müşteri123',   toAccount: 'Ziraat Bankası', status: 'Completed', referenceNo: 'TXN-001-2026', createdAt: new Date(Date.now() - 3600000).toISOString() },
      { type: 'Withdrawal', amount: 5000,  currency: 'TRY', fromAccount: 'Garanti BBVA', toAccount: 'Müşteri456',    status: 'Completed', referenceNo: 'TXN-002-2026', createdAt: new Date(Date.now() - 7200000).toISOString() },
      { type: 'Transfer',   amount: 20000, currency: 'TRY', fromAccount: 'Akbank',       toAccount: 'İş Bankası',    status: 'Pending',   referenceNo: 'TXN-003-2026', createdAt: new Date().toISOString() },
    ]);
  }

  async findSubTransfers(startDate?: string, endDate?: string, status?: string): Promise<SubTransferEntity[]> {
    let result = await this.subRepo.find({ order: { stTransferDate: 'DESC' } });
    if (startDate) result = result.filter((s) => s.stTransferDate >= startDate);
    if (endDate)   result = result.filter((s) => s.stTransferDate <= endDate);
    if (status)    result = result.filter((s) => s.stTransferStatus === status);
    return result;
  }

  async findAllSubTransfers(): Promise<SubTransferEntity[]> {
    return this.subRepo.find({ order: { stTransferDate: 'DESC' } });
  }

  async findAllTransactions(): Promise<TransactionEntity[]> {
    return this.txRepo.find({ order: { createdAt: 'DESC' } });
  }
}
