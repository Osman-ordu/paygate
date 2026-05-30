import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LPQuickTransactionController } from './lp-quick-transaction.controller';
import { LPQuickTransactionRepository } from './lp-quick-transaction.repository';
import { LPQuickTransactionEntity } from './lp-quick-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LPQuickTransactionEntity])],
  controllers: [LPQuickTransactionController],
  providers: [LPQuickTransactionRepository],
})
export class LPQuickTransactionModule {}
