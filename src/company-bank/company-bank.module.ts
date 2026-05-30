import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyBankController } from './company-bank.controller';
import { CompanyBankRepository } from './company-bank.repository';
import { CompanyBankEntity } from './company-bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyBankEntity])],
  controllers: [CompanyBankController],
  providers: [CompanyBankRepository],
  exports: [CompanyBankRepository],
})
export class CompanyBankModule {}
