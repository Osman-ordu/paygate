import { Controller, Get, Put, Body, Query } from '@nestjs/common';
import { SettingsRepository } from './settings.repository';

@Controller('api/Setting')
export class SettingsController {
  constructor(private readonly repo: SettingsRepository) {}

  @Get('credentials')
  async getCredentials(@Query('type') type?: string) {
    if (type) {
      return { data: (await this.repo.getCredentialByType(type)) || null };
    }
    return { data: await this.repo.getAllCredentials() };
  }

  @Put('credentials')
  async updateCredential(@Body() body: any) {
    const updated = await this.repo.updateCredential(body);
    return { success: true, data: updated };
  }

  @Get('serviceManagement')
  async getServices() {
    return { data: await this.repo.getAllServices() };
  }

  @Put('serviceManagement')
  async updateService(@Body() body: any) {
    const updated = await this.repo.updateService(body);
    if (!updated) return { success: false };
    return { success: true, data: updated };
  }
}
