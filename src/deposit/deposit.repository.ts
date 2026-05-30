import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepositEntity } from './deposit.entity';
import { DepositLogEntity } from './deposit-log.entity';

function randomDate(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * 86400000 - Math.random() * 86400000).toISOString();
}

const COMPANY_BANKS = ['PSP Ziraat Ödeme Hesabı', 'PSP Garanti Çekim Hesabı', 'PSP Vakıfbank Ödeme Hesabı', 'PSP Akbank Hesabı'];
const USER_BANKS    = ['Yapı Kredi', 'QNB Finansbank', 'Denizbank', 'HSBC', 'TEB'];
const IBANS         = ['TR330006100519786457841326', 'TR400006200096390075700001', 'TR320001500158007292515668', 'TR980046100000000012345678'];
const TCKNS         = ['12345678901', '98765432109', '11223344556', '55667788990', '10293847560'];
const STATUSES      = [0, 1, 2, 3];

@Injectable()
export class DepositRepository {
  constructor(
    @InjectRepository(DepositEntity)
    private readonly repo: Repository<DepositEntity>,
    @InjectRepository(DepositLogEntity)
    private readonly logRepo: Repository<DepositLogEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) return;

    const seeds = Array.from({ length: 120 }, (_, i) => ({
      uid: 100000 + i + 1,
      companyBankName: COMPANY_BANKS[i % COMPANY_BANKS.length],
      depositDate: randomDate(Math.floor(i / 5)),
      receiptNo: 200000 + i + 1,
      userBankName: USER_BANKS[i % USER_BANKS.length],
      iban: IBANS[i % IBANS.length],
      tckn: TCKNS[i % TCKNS.length],
      amount: Math.round((Math.random() * 9900 + 100) * 100) / 100,
      symbol: 'TRY',
      transactionStatus: STATUSES[i % STATUSES.length],
      transactionNo: `DEP-${String(i + 1).padStart(6, '0')}`,
      depositDescriptionIade: i % 5 === 0 ? 'Hatalı işlem iadesi' : null,
      refund: i % 5 === 0 ? 1 : null,
      refundTransactionNo: i % 5 === 0 ? `REF-${String(i + 1).padStart(6, '0')}` : null,
      masakDecRequeired: i % 7 === 0,
      masakReport: i % 7 === 0 && i % 14 === 0,
    }));
    await this.repo.save(seeds);

    await this.logRepo.save([
      {
        request:  JSON.stringify({ action: 'DEPOSIT_INIT', amount: 10000, iban: 'TR330006100519786457841326', timestamp: new Date().toISOString() }),
        response: JSON.stringify({ status: 'SUCCESS', referenceNo: 'DEP-000001', bankResponseCode: '00', message: 'Yatırım işlemi başarıyla alındı' }),
      },
      {
        request:  JSON.stringify({ action: 'STATUS_UPDATE', referenceNo: 'DEP-000001', newStatus: 1, timestamp: new Date().toISOString() }),
        response: JSON.stringify({ status: 'COMPLETED', bankResponseCode: '00', completedAt: new Date().toISOString() }),
      },
    ]);
  }

  async getList(take: number, page: number, filters: any[], sort: any): Promise<{ result: DepositEntity[]; totalCount: number }> {
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
      data.sort((a, b) => b.depositDate.localeCompare(a.depositDate));
    }

    const totalCount = data.length;
    return { result: data.slice(page * take, page * take + take), totalCount };
  }

  async getLog(_depositId: string): Promise<DepositLogEntity[]> {
    return this.logRepo.find();
  }

  async updateStatus(depositId: string, transactionStatus: number, refundStatus: number | null, comment: string | null): Promise<boolean> {
    const item = await this.repo.findOne({ where: { id: depositId } });
    if (!item) return false;
    const update: Partial<DepositEntity> = { transactionStatus };
    if (refundStatus !== undefined && refundStatus !== null) update.refund = refundStatus;
    if (comment !== null) update.depositDescriptionIade = comment;
    await this.repo.update(depositId, update);
    await this.logRepo.save({
      request:  JSON.stringify({ action: 'STATUS_UPDATE', depositId, newStatus: transactionStatus, timestamp: new Date().toISOString() }),
      response: JSON.stringify({ status: 'SUCCESS', bankResponseCode: '00' }),
    });
    return true;
  }

  async refund(id: string): Promise<boolean> {
    const result = await this.repo.update(id, { refund: 1, refundTransactionNo: `REF-${Date.now()}` });
    return (result.affected ?? 0) > 0;
  }

  async reject(id: string): Promise<boolean> {
    const result = await this.repo.update(id, { transactionStatus: 2 });
    return (result.affected ?? 0) > 0;
  }

  async confirm(id: string): Promise<boolean> {
    const result = await this.repo.update(id, { transactionStatus: 1 });
    return (result.affected ?? 0) > 0;
  }

  async changeMasakResult(id: string, resultVal: string): Promise<boolean> {
    const masakReport = resultVal === 'true' || resultVal === '1';
    const result = await this.repo.update(id, { masakReport });
    return (result.affected ?? 0) > 0;
  }

  async exportAll(filters: any[], sort: any): Promise<DepositEntity[]> {
    const { result } = await this.getList(Number.MAX_SAFE_INTEGER, 0, filters, sort);
    return result;
  }
}
