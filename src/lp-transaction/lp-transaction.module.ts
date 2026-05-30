import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LPTransactionController } from './lp-transaction.controller';
import { LPTransactionRepository } from './lp-transaction.repository';
import { LPTransactionEntity } from './lp-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LPTransactionEntity])],
  controllers: [LPTransactionController],
  providers: [LPTransactionRepository],
  exports: [LPTransactionRepository],
})
export class LPTransactionModule {}
