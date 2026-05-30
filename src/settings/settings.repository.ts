import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CredentialEntity, ServiceEntity } from './credential.entity';

@Injectable()
export class SettingsRepository {
  constructor(
    @InjectRepository(CredentialEntity)
    private readonly credRepo: Repository<CredentialEntity>,
    @InjectRepository(ServiceEntity)
    private readonly svcRepo: Repository<ServiceEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.credRepo.count();
    if (count > 0) return;

    await this.credRepo.save([
      { type: 'ZiraatBankSettings',       userName: 'ziraat_user', password: '***', tosUserName: 'ziraat_tos_user', tosPassword: '***', apiUrl: 'https://api.ziraat.example.com',       secondApiUrl: 'https://api2.ziraat.example.com', accountNo: '0519786457841326', customerNo: 'CUST001', realSenderName: 'PSP Teknoloji A.Ş.' },
      { type: 'VakifbankSettings',         userName: 'vakif_user',  password: '***', tosUserName: 'vakif_tos_user',  tosPassword: '***', apiUrl: 'https://api.vakifbank.example.com',    secondApiUrl: '',                                 accountNo: '0158007292515668', customerNo: 'CUST002', realSenderName: 'PSP Teknoloji A.Ş.' },
      { type: 'SekerbankCredentials',      userName: 'seker_user',  password: '***', tosUserName: '',                tosPassword: '',    apiUrl: 'https://api.sekerbank.example.com',    secondApiUrl: '',                                 accountNo: '001234567',       customerNo: 'CUST003', realSenderName: 'PSP Teknoloji A.Ş.' },
      { type: 'TurkiyeFinansBankSettings', userName: 'tf_user',     password: '***', tosUserName: '',                tosPassword: '',    apiUrl: 'https://api.turkiyefinans.example.com', secondApiUrl: '',                                accountNo: '009876543',       customerNo: 'CUST004', realSenderName: 'PSP Teknoloji A.Ş.' },
      { type: 'BinanceTrSettings',         apiKey: 'bntr_api_key_***', secretKey: '***', apiUrl: 'https://api.binance.com',    passPhrase: '' },
      { type: 'WhitebitSettings',          apiKey: 'wb_api_key_***',   secretKey: '***', apiUrl: 'https://api.whitebit.com',   passPhrase: '' },
      { type: 'OkxSettings',               apiKey: 'okx_api_key_***',  secretKey: '***', apiUrl: 'https://www.okx.com',        passPhrase: 'okx_phrase' },
      { type: 'CoinTrSettings',            apiKey: 'cointr_api_key_***', secretKey: '***', apiUrl: 'https://api.cointr.com',   passPhrase: '' },
      { type: 'ChainUpCredentials',        apiKey: 'chainup_user',     secretKey: '***', apiUrl: 'https://api.chainup.com' },
    ]);

    await this.svcRepo.save([
      { serviceName: 'ZiraatDepositService',    workFrequency: 30,   status: true,  lastUpdateBy: 'admin@admin.com', lastUpdateAt: new Date().toISOString(), integrationType: 'BANKS' },
      { serviceName: 'VakifbankDepositService', workFrequency: 30,   status: true,  lastUpdateBy: 'admin@admin.com', lastUpdateAt: new Date().toISOString(), integrationType: 'BANKS' },
      { serviceName: 'WithdrawalService',       workFrequency: 60,   status: true,  lastUpdateBy: 'admin@admin.com', lastUpdateAt: new Date().toISOString(), integrationType: 'BANKS' },
      { serviceName: 'BinanceTrLPService',      workFrequency: null, status: false, lastUpdateBy: null,              lastUpdateAt: null,                     integrationType: 'LPS' },
      { serviceName: 'OkxLPService',            workFrequency: null, status: true,  lastUpdateBy: 'admin@admin.com', lastUpdateAt: new Date().toISOString(), integrationType: 'LPS' },
      { serviceName: 'ChainUpExchangeService',  workFrequency: null, status: true,  lastUpdateBy: 'admin@admin.com', lastUpdateAt: new Date().toISOString(), integrationType: 'EXCHANGE' },
    ]);
  }

  async getAllCredentials(): Promise<CredentialEntity[]> {
    return this.credRepo.find();
  }

  async getCredentialByType(type: string): Promise<CredentialEntity | null> {
    return this.credRepo.findOne({ where: { type } });
  }

  async updateCredential(data: Partial<CredentialEntity> & { type: string }): Promise<CredentialEntity> {
    const existing = await this.credRepo.findOne({ where: { type: data.type } });
    if (existing) {
      await this.credRepo.update(existing.id, data);
      return (await this.credRepo.findOne({ where: { id: existing.id } }))!;
    }
    return this.credRepo.save(this.credRepo.create(data));
  }

  async getAllServices(): Promise<ServiceEntity[]> {
    return this.svcRepo.find();
  }

  async updateService(data: Partial<ServiceEntity> & { id: string }): Promise<ServiceEntity | null> {
    await this.svcRepo.update(data.id, { ...data, lastUpdateAt: new Date().toISOString() });
    return this.svcRepo.findOne({ where: { id: data.id } });
  }
}
