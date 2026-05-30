import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EODBalanceController } from './eod-balance.controller';
import { EODBalanceRepository } from './eod-balance.repository';
import { EODBalanceEntity } from './eod-balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EODBalanceEntity])],
  controllers: [EODBalanceController],
  providers: [EODBalanceRepository],
})
export class EODBalanceModule {}
