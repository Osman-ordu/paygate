import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsController } from './settings.controller';
import { SettingsRepository } from './settings.repository';
import { CredentialEntity, ServiceEntity } from './credential.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CredentialEntity, ServiceEntity])],
  controllers: [SettingsController],
  providers: [SettingsRepository],
  exports: [SettingsRepository],
})
export class SettingsModule {}
