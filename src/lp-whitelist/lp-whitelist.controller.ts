import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { LPWhitelistRepository } from './lp-whitelist.repository';

@Controller('api/LPWhitelist')
export class LPWhitelistController {
  constructor(private readonly repo: LPWhitelistRepository) {}

  @Get('getActiveList')
  async getActive() {
    return { data: await this.repo.findActive() };
  }

  @Get('okxVaspName')
  getOkxVaspNames() {
    return { data: this.repo.getOkxVaspList() };
  }

  @Get()
  async findAll() {
    return { data: await this.repo.findAll() };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return { data: (await this.repo.findById(id)) || null };
  }

  @Post()
  async add(@Body() body: any) {
    const item = await this.repo.add(body);
    return { success: true, data: { id: item.id } };
  }

  @Put()
  async update(@Body() body: any) {
    const item = await this.repo.update(body);
    if (!item) return { success: false };
    return { success: true, data: null };
  }

  @Put('changeStatus/:id')
  async changeStatus(@Param('id') id: string) {
    const item = await this.repo.toggleStatus(id);
    if (!item) return { success: false };
    return { success: true, data: null };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const ok = await this.repo.delete(id);
    return { success: ok };
  }
}
