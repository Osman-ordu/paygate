import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { CompanyBankModule } from './company-bank/company-bank.module';
import { BankAccountModule } from './bank-account/bank-account.module';
import { LPAccountModule } from './lp-account/lp-account.module';
import { LPTransactionModule } from './lp-transaction/lp-transaction.module';
import { AutoTransferModule } from './auto-transfer/auto-transfer.module';
import { WhitelistAccountsModule } from './whitelist-accounts/whitelist-accounts.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { SettingsModule } from './settings/settings.module';
import { LPWhitelistModule } from './lp-whitelist/lp-whitelist.module';
import { LPQuickTransactionModule } from './lp-quick-transaction/lp-quick-transaction.module';
import { TreasuryTransferModule } from './treasury-transfer/treasury-transfer.module';
import { SubTransferModule } from './sub-transfer/sub-transfer.module';
import { EODBalanceModule } from './eod-balance/eod-balance.module';
import { DepositModule } from './deposit/deposit.module';
import { WithdrawalModule } from './withdrawal/withdrawal.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'corecrud_user',
      password: process.env.DB_PASSWORD || 'ChangeMe_StrongPass123!',
      database: process.env.DB_NAME || 'corecrud',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UserModule,
    HealthCheckModule,
    CompanyBankModule,
    BankAccountModule,
    LPAccountModule,
    LPTransactionModule,
    AutoTransferModule,
    WhitelistAccountsModule,
    RolePermissionModule,
    SettingsModule,
    LPWhitelistModule,
    LPQuickTransactionModule,
    TreasuryTransferModule,
    SubTransferModule,
    EODBalanceModule,
    DepositModule,
    WithdrawalModule,
  ],
})
export class AppModule {}
