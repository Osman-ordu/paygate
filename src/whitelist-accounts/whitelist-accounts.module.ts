import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhitelistAccountsController } from './whitelist-accounts.controller';
import { WhitelistAccountsRepository } from './whitelist-accounts.repository';
import { WhitelistAccountEntity } from './whitelist-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WhitelistAccountEntity])],
  controllers: [WhitelistAccountsController],
  providers: [WhitelistAccountsRepository],
  exports: [WhitelistAccountsRepository],
})
export class WhitelistAccountsModule {}
