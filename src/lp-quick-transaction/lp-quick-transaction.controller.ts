import { Controller, Get, Post, Delete, Body, Query } from '@nestjs/common';
import { LPQuickTransactionRepository } from './lp-quick-transaction.repository';

@Controller('api/LPQuickTransaction')
export class LPQuickTransactionController {
  constructor(private readonly repo: LPQuickTransactionRepository) {}

  @Get()
  async findAll() {
    return { data: await this.repo.findAll() };
  }

  @Post()
  async add(@Body() body: any) {
    const item = await this.repo.add(body);
    return { success: true, data: { id: item.id } };
  }

  @Delete()
  async delete(@Query('id') id: string) {
    const ok = await this.repo.delete(id);
    return { success: ok };
  }
}
