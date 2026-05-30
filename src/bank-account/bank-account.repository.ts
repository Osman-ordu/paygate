import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccountEntity } from './bank-account.entity';

@Injectable()
export class BankAccountRepository {
  constructor(
    @InjectRepository(BankAccountEntity)
    private readonly repo: Repository<BankAccountEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) return;
    await this.repo.save([
      {
        companyBankId: 'cb000001-0000-0000-0000-000000000001',
        companyBankName: 'Ziraat Bankası',
        iban: 'TR330006100519786457841326',
        accountName: 'PSP Ziraat Ödeme Hesabı',
        accountNo: '0519786457841326',
        accountHolderName: 'PSP Teknoloji A.Ş.',
        vkn: '1234567890',
        priority: 1, status: 1, accountType: 2,
        balance: 1250000, availableBalance: 1100000,
      },
      {
        companyBankId: 'cb000001-0000-0000-0000-000000000002',
        companyBankName: 'Vakıfbank',
        iban: 'TR320001500158007292515668',
        accountName: 'PSP Vakıfbank Ödeme Hesabı',
        accountNo: '0158007292515668',
        accountHolderName: 'PSP Teknoloji A.Ş.',
        vkn: '1234567890',
        priority: 2, status: 1, accountType: 2,
        balance: 875000.50, availableBalance: 750000.50,
      },
      {
        companyBankId: 'cb000001-0000-0000-0000-000000000003',
        companyBankName: 'Garanti BBVA',
        iban: 'TR400006200096390075700001',
        accountName: 'PSP Garanti Çekim Hesabı',
        accountNo: '0096390075700001',
        accountHolderName: 'PSP Teknoloji A.Ş.',
        vkn: '1234567890',
        priority: 1, status: 1, accountType: 1,
        balance: 500000, availableBalance: 450000,
      },
      {
        companyBankId: 'cb000001-0000-0000-0000-000000000004',
        companyBankName: 'İş Bankası',
        iban: 'TR490006400000210049001001',
        accountName: 'PSP İş Bankası Yedek Hesabı',
        accountNo: '00210049001001',
        accountHolderName: 'PSP Teknoloji A.Ş.',
        vkn: '1234567890',
        priority: 3, status: 0, accountType: null,
        balance: 0, availableBalance: 0,
      },
    ]);
  }

  async findAll(): Promise<BankAccountEntity[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<BankAccountEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<BankAccountEntity>): Promise<BankAccountEntity> {
    const account = this.repo.create({ balance: 0, availableBalance: 0, ...data });
    return this.repo.save(account);
  }

  async update(id: string, data: Partial<BankAccountEntity>): Promise<BankAccountEntity | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  getPriorities(): number[] {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  async getDetails() {
    const accounts = await this.repo.find({ where: { status: 1 } });
    return accounts.map((a) => ({
      companyBankName: a.companyBankName,
      currency: 'TRY',
      balance: a.balance,
      availableBalance: a.availableBalance,
      name: a.accountName,
      priority: a.priority,
    }));
  }

  async getAccountList() {
    const accounts = await this.repo.find({ where: { status: 1 } });
    return accounts.map((a) => ({ id: a.id, accountName: a.accountName, iban: a.iban }));
  }

  async getConsensus(currency: string, _startDate: string, _endDate: string) {
    const accounts = await this.repo.find({ where: { status: 1 } });
    return accounts.map((a) => ({
      bankName: a.companyBankName,
      currency,
      depositAmount: Math.floor(Math.random() * 100000),
      withdrawAmount: Math.floor(Math.random() * 50000),
      accountName: a.accountName,
    }));
  }
}
