import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LPWhitelistEntity } from './lp-whitelist.entity';

const OKX_VASP_LIST = [
  'Binance', 'OKX', 'Whitebit', 'Coinbase', 'Kraken',
  'Huobi', 'KuCoin', 'Gate.io', 'Bitfinex', 'Bybit',
];

@Injectable()
export class LPWhitelistRepository {
  constructor(
    @InjectRepository(LPWhitelistEntity)
    private readonly repo: Repository<LPWhitelistEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) return;
    await this.repo.save([
      {
        accountName: 'Müşteri USDT Cüzdanı 1', lpName: 'BinanceTR', currency: 'USDT',
        walletAddress: 'TXyzAbc123DefGhi456', network: 'TRC20', memoTag: null,
        channel: 'Crypto', vaspName: 'Binance', targetType: 'Individual',
        innerToType: null, entity: 'PSP', name: 'Ali', surname: 'Veli',
        birthdate: '1990-01-15', corporateName: null, corporateAddress: null,
        description: 'Bireysel müşteri cüzdanı', country: 'TR', city: 'Istanbul',
        district: 'Kadıköy', streetName: 'Moda Caddesi', status: 1,
      },
      {
        accountName: 'Kurumsal USDT Cüzdanı', lpName: 'OKX', currency: 'USDT',
        walletAddress: 'TOKX001XYZCorporate', network: 'TRC20', memoTag: 'MEMO123',
        channel: 'Crypto', vaspName: 'OKX', targetType: 'Corporate',
        innerToType: null, entity: 'External', name: null, surname: null,
        birthdate: null, corporateName: 'ABC Şirketi Ltd. Şti.', corporateAddress: 'İstanbul, TR',
        description: 'Kurumsal çekim cüzdanı', country: 'TR', city: 'Ankara',
        district: 'Çankaya', streetName: 'Atatürk Bulvarı', status: 1,
      },
    ]);
  }

  async findAll(): Promise<LPWhitelistEntity[]> {
    return this.repo.find();
  }

  async findActive(): Promise<LPWhitelistEntity[]> {
    return this.repo.find({ where: { status: 1 } });
  }

  async findById(id: string): Promise<LPWhitelistEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  getOkxVaspList(): string[] {
    return OKX_VASP_LIST;
  }

  async add(data: Partial<LPWhitelistEntity>): Promise<LPWhitelistEntity> {
    const item = this.repo.create({ status: 1, ...data });
    return this.repo.save(item);
  }

  async update(data: Partial<LPWhitelistEntity> & { id: string }): Promise<LPWhitelistEntity | null> {
    await this.repo.update(data.id, data);
    return this.findById(data.id);
  }

  async toggleStatus(id: string): Promise<LPWhitelistEntity | null> {
    const item = await this.findById(id);
    if (!item) return null;
    await this.repo.update(id, { status: item.status === 1 ? 0 : 1 });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
