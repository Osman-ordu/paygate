import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AutoTransferRepository } from './auto-transfer.repository';

@Controller('api/AutoTransfer')
export class AutoTransferController {
  constructor(private readonly repo: AutoTransferRepository) {}

  @Get()
  async findAll() {
    return { data: await this.repo.findAll() };
  }

  @Post()
  async create(@Body() body: any) {
    const rule = await this.repo.create(body);
    return { success: true, data: { id: rule.id } };
  }

  @Put()
  async update(@Body() body: any) {
    const rule = await this.repo.update(body.id, body);
    if (!rule) return { success: false };
    return { success: true, data: null };
  }

  @Put('changestatus/:id')
  async changeStatus(@Param('id') id: string) {
    const rule = await this.repo.toggleStatus(id);
    if (!rule) return { success: false };
    return { success: true, data: null };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const ok = await this.repo.delete(id);
    return { success: ok };
  }

  @Get('getTransactions')
  async getTransactions() {
    return { data: await this.repo.getLogs() };
  }
}
