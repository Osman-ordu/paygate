import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositController } from './deposit.controller';
import { DepositRepository } from './deposit.repository';
import { DepositEntity } from './deposit.entity';
import { DepositLogEntity } from './deposit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DepositEntity, DepositLogEntity])],
  controllers: [DepositController],
  providers: [DepositRepository],
})
export class DepositModule {}
