import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreasuryTransferController } from './treasury-transfer.controller';
import { TreasuryTransferRepository } from './treasury-transfer.repository';
import { QuickTransactionController } from './quick-transaction.controller';
import { TreasuryAccountEntity } from './treasury-account.entity';
import { TreasuryTransferEntity } from './treasury-transfer.entity';
import { QuickTransactionEntity } from './quick-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TreasuryAccountEntity, TreasuryTransferEntity, QuickTransactionEntity])],
  controllers: [TreasuryTransferController, QuickTransactionController],
  providers: [TreasuryTransferRepository],
})
export class TreasuryTransferModule {}
