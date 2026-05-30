import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LPWhitelistController } from './lp-whitelist.controller';
import { LPWhitelistRepository } from './lp-whitelist.repository';
import { LPWhitelistEntity } from './lp-whitelist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LPWhitelistEntity])],
  controllers: [LPWhitelistController],
  providers: [LPWhitelistRepository],
  exports: [LPWhitelistRepository],
})
export class LPWhitelistModule {}
