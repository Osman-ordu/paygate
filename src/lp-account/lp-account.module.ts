import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LPAccountController } from './lp-account.controller';
import { LPAccountRepository } from './lp-account.repository';
import { LPAccountEntity, LPAccountWalletEntity } from './lp-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LPAccountEntity, LPAccountWalletEntity])],
  controllers: [LPAccountController],
  providers: [LPAccountRepository],
  exports: [LPAccountRepository],
})
export class LPAccountModule {}
