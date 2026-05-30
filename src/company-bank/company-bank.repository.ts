import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyBankEntity } from './company-bank.entity';

@Injectable()
export class CompanyBankRepository {
  constructor(
    @InjectRepository(CompanyBankEntity)
    private readonly repo: Repository<CompanyBankEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) return;
    await this.repo.save([
      { name: 'Ziraat Bankası',     bankCode: '010', openingTime: '08:00', closingTime: '18:00', status: 1 },
      { name: 'Vakıfbank',          bankCode: '015', openingTime: '08:00', closingTime: '18:00', status: 1 },
      { name: 'Garanti BBVA',       bankCode: '062', openingTime: '08:30', closingTime: '17:30', status: 1 },
      { name: 'İş Bankası',         bankCode: '064', openingTime: '08:30', closingTime: '17:30', status: 1 },
      { name: 'Yapı Kredi',         bankCode: '067', openingTime: '09:00', closingTime: '17:00', status: 1 },
      { name: 'Akbank',             bankCode: '046', openingTime: '09:00', closingTime: '17:00', status: 1 },
      { name: 'Şekerbank',          bankCode: '059', openingTime: '09:00', closingTime: '17:00', status: 1 },
      { name: 'Türkiye Finans',     bankCode: '206', openingTime: '09:00', closingTime: '17:00', status: 1 },
    ]);
  }

  async findAll(): Promise<CompanyBankEntity[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<CompanyBankEntity | null> {
    return this.repo.findOne({ where: { id } });
  }
}
