import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubTransferController } from './sub-transfer.controller';
import { TransactionController } from './transaction.controller';
import { SubTransferRepository } from './sub-transfer.repository';
import { SubTransferEntity, TransactionEntity } from './sub-transfer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubTransferEntity, TransactionEntity])],
  controllers: [SubTransferController, TransactionController],
  providers: [SubTransferRepository],
})
export class SubTransferModule {}
