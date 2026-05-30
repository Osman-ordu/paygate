import { Injectable, NotFoundException } from '@nestjs/common';
import { BankAccountRepository } from './bank-account.repository';
import { CompanyBankRepository } from '../company-bank/company-bank.repository';

@Injectable()
export class BankAccountService {
  constructor(
    private readonly repo: BankAccountRepository,
    private readonly companyBankRepo: CompanyBankRepository,
  ) {}

  async findAll() {
    return { data: await this.repo.findAll() };
  }

  async create(body: {
    iban: string;
    accountNo: string;
    accountName: string;
    companyBankId: string;
    priority: number;
    status: number;
    accountHolderName: string;
    vkn: string;
    accountType: number | null;
  }) {
    const bank = await this.companyBankRepo.findById(body.companyBankId);
    const account = await this.repo.create({
      ...body,
      companyBankName: bank?.name || 'Unknown Bank',
    });
    return { success: true, data: { id: account.id } };
  }

  async update(body: {
    id: string;
    iban?: string;
    accountNo?: string;
    accountName?: string;
    companyBankId?: string;
    priority?: number;
    status?: number;
    accountHolderName?: string;
    vkn?: string;
    accountType?: number | null;
  }) {
    const bank = body.companyBankId
      ? await this.companyBankRepo.findById(body.companyBankId)
      : undefined;

    const account = await this.repo.update(body.id, {
      ...body,
      ...(bank ? { companyBankName: bank.name } : {}),
    });
    if (!account) throw new NotFoundException('Bank account not found');
    return { success: true, data: null };
  }

  async getDetails() {
    return { data: await this.repo.getDetails() };
  }

  async getAccountList() {
    return { data: await this.repo.getAccountList() };
  }

  async getPriorities() {
    return { data: this.repo.getPriorities() };
  }

  async getConsensus(body: { currency: string; startDate: string; endDate: string }) {
    return { data: await this.repo.getConsensus(body.currency, body.startDate, body.endDate) };
  }
}
