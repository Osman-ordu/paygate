import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WithdrawalEntity } from './withdrawal.entity';
import { WithdrawalLogEntity } from './withdrawal-log.entity';

function randomDate(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * 86400000 - Math.random() * 86400000).toISOString();
}

const COMPANY_BANKS  = ['PSP Ziraat Ödeme Hesabı', 'PSP Garanti Çekim Hesabı', 'PSP Vakıfbank Ödeme Hesabı'];
const MEMBER_BANKS   = ['Yapı Kredi', 'QNB Finansbank', 'Denizbank', 'HSBC', 'TEB', 'Akbank'];
const IBANS          = ['TR330006100519786457841326', 'TR400006200096390075700001', 'TR320001500158007292515668', 'TR980046100000000012345678', 'TR140006701000000009999999'];
const TCKNS          = ['12345678901', '98765432109', '11223344556', '55667788990', '10293847560'];
const CHANNELS       = ['EFT', 'Havale', 'FAST'];

export interface WithdrawalRefund {
  id: string;
  uid: number;
  sendAccount: string;
  transactionDate: string;
  transactionNo: string;
  channel: string;
  membersBank: string;
  iban: string;
  tckn: string;
  amount: number;
  currency: string;
  transactionStatus: number;
  reasonForRefund: string | null;
}

@Injectable()
export class WithdrawalRepository {
  constructor(
    @InjectRepository(WithdrawalEntity)
    private readonly repo: Repository<WithdrawalEntity>,
    @InjectRepository(WithdrawalLogEntity)
    private readonly logRepo: Repository<WithdrawalLogEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) return;

    const seeds = Array.from({ length: 110 }, (_, i) => ({
      uid: 200000 + i + 1,
      companyBankName: COMPANY_BANKS[i % COMPANY_BANKS.length],
      withdrawDate: randomDate(Math.floor(i / 5)),
      recordId: `WDR-${String(i + 1).padStart(6, '0')}`,
      channel: CHANNELS[i % CHANNELS.length],
      bankName: MEMBER_BANKS[i % MEMBER_BANKS.length],
      iban: IBANS[i % IBANS.length],
      tckn: TCKNS[i % TCKNS.length],
      amount: Math.round((Math.random() * 9900 + 100) * 100) / 100,
      symbol: 'TRY',
      transactionStatus: i % 6,
      withdrawDescription: i % 4 === 0 ? 'Müşteri talebi' : null,
    }));
    await this.repo.save(seeds);

    await this.logRepo.save([
      {
        request:  JSON.stringify({ action: 'WITHDRAWAL_INIT', amount: 5000, iban: 'TR330006100519786457841326', timestamp: new Date().toISOString() }),
        response: JSON.stringify({ status: 'SUCCESS', referenceNo: 'WDR-000001', bankResponseCode: '00', message: 'İşlem başarıyla gerçekleştirildi' }),
      },
      {
        request:  JSON.stringify({ action: 'STATUS_CHECK', referenceNo: 'WDR-000001', timestamp: new Date().toISOString() }),
        response: JSON.stringify({ status: 'COMPLETED', bankResponseCode: '00', completedAt: new Date().toISOString() }),
      },
    ]);
  }

  async getList(take: number, page: number, filters: any[], sort: any): Promise<{ result: WithdrawalEntity[]; totalCount: number }> {
    let data = await this.repo.find();

    if (filters && filters.length > 0) {
      for (const f of filters) {
        const { field, op, result } = f;
        if (!field || result === undefined || result === null || result === '') continue;
        const val = String(result).toLowerCase();
        data = data.filter((d) => {
          const fieldVal = String((d as any)[field] ?? '').toLowerCase();
          switch (op) {
            case 'contains':    return fieldVal.includes(val);
            case 'equals':      return fieldVal === val;
            case 'startswith':  return fieldVal.startsWith(val);
            case '>':  return parseFloat(fieldVal) > parseFloat(val);
            case '<':  return parseFloat(fieldVal) < parseFloat(val);
            case '>=': return parseFloat(fieldVal) >= parseFloat(val);
            case '<=': return parseFloat(fieldVal) <= parseFloat(val);
            default: return true;
          }
        });
      }
    }

    if (sort && sort.field) {
      data.sort((a, b) => {
        const av = (a as any)[sort.field];
        const bv = (b as any)[sort.field];
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return sort.desc ? -cmp : cmp;
      });
    } else {
      data.sort((a, b) => b.withdrawDate.localeCompare(a.withdrawDate));
    }

    const totalCount = data.length;
    return { result: data.slice(page * take, page * take + take), totalCount };
  }

  async getLog(_transactionId: string): Promise<WithdrawalLogEntity[]> {
    return this.logRepo.find();
  }

  async getAll(): Promise<WithdrawalEntity[]> {
    return this.repo.find();
  }

  async getRefunds(startDate?: string, endDate?: string): Promise<WithdrawalRefund[]> {
    let data = (await this.repo.find())
      .filter((w) => w.transactionStatus === 4 || w.transactionStatus === 0)
      .map((w): WithdrawalRefund => ({
        id: w.id,
        uid: w.uid,
        sendAccount: w.companyBankName,
        transactionDate: w.withdrawDate,
        transactionNo: w.recordId,
        channel: w.channel,
        membersBank: w.bankName,
        iban: w.iban,
        tckn: w.tckn,
        amount: w.amount,
        currency: w.symbol,
        transactionStatus: w.transactionStatus,
        reasonForRefund: w.withdrawDescription,
      }));
    if (startDate) data = data.filter((w) => w.transactionDate >= startDate);
    if (endDate)   data = data.filter((w) => w.transactionDate <= endDate);
    return data;
  }
}
