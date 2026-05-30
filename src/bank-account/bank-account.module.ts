import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountController } from './bank-account.controller';
import { BankAccountService } from './bank-account.service';
import { BankAccountRepository } from './bank-account.repository';
import { BankAccountEntity } from './bank-account.entity';
import { CompanyBankModule } from '../company-bank/company-bank.module';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccountEntity]), CompanyBankModule],
  controllers: [BankAccountController],
  providers: [BankAccountService, BankAccountRepository],
  exports: [BankAccountRepository],
})
export class BankAccountModule {}
