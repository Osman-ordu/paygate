import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutoTransferController } from './auto-transfer.controller';
import { AutoTransferRepository } from './auto-transfer.repository';
import { AutoTransferEntity, AutoTransferTransactionEntity } from './auto-transfer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AutoTransferEntity, AutoTransferTransactionEntity])],
  controllers: [AutoTransferController],
  providers: [AutoTransferRepository],
  exports: [AutoTransferRepository],
})
export class AutoTransferModule {}
