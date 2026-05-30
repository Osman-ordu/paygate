import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawalController } from './withdrawal.controller';
import { WithdrawalRepository } from './withdrawal.repository';
import { WithdrawalEntity } from './withdrawal.entity';
import { WithdrawalLogEntity } from './withdrawal-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WithdrawalEntity, WithdrawalLogEntity])],
  controllers: [WithdrawalController],
  providers: [WithdrawalRepository],
})
export class WithdrawalModule {}
