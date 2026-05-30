import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhitelistAccountEntity } from './whitelist-account.entity';

@Injectable()
export class WhitelistAccountsRepository {
  constructor(
    @InjectRepository(WhitelistAccountEntity)
    private readonly repo: Repository<WhitelistAccountEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) return;
    await this.repo.save([
      { readableName: 'Ali Veli Ödeme Hesabı', bankName: 'Ziraat Bankası', fullName: 'Ali Veli',              tcknVkn: '12345678901', iban: 'TR330006100519786457841326', comment: 'Müşteri çekim hesabı', status: 1 },
      { readableName: 'Ahmet Kaya Hesabı',      bankName: 'Garanti BBVA',  fullName: 'Ahmet Kaya',            tcknVkn: '98765432109', iban: 'TR400006200096390075700002', comment: 'VIP müşteri hesabı',   status: 1 },
      { readableName: 'Şirket A Hesabı',        bankName: 'İş Bankası',    fullName: 'Şirket A Ltd. Şti.',    tcknVkn: '1234567890',  iban: 'TR490006400000210049001002', comment: 'Kurumsal müşteri',      status: 0 },
    ]);
  }

  async findAll(): Promise<WhitelistAccountEntity[]> {
    return this.repo.find();
  }

  async findById(id: number): Promise<WhitelistAccountEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async add(data: Partial<WhitelistAccountEntity>): Promise<WhitelistAccountEntity> {
    const account = this.repo.create({ status: 1, ...data });
    return this.repo.save(account);
  }

  async update(data: Partial<WhitelistAccountEntity> & { id: number }): Promise<WhitelistAccountEntity | null> {
    await this.repo.update(data.id, data);
    return this.findById(data.id);
  }

  async toggleStatus(id: number): Promise<WhitelistAccountEntity | null> {
    const account = await this.findById(id);
    if (!account) return null;
    await this.repo.update(id, { status: account.status === 1 ? 0 : 1 });
    return this.findById(id);
  }
}
