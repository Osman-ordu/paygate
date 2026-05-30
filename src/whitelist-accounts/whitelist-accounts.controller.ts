import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WhitelistAccountsRepository } from './whitelist-accounts.repository';

@Controller()
export class WhitelistAccountsController {
  constructor(private readonly repo: WhitelistAccountsRepository) {}

  @Get('api/Whitelist')
  async findAll() {
    return { data: await this.repo.findAll() };
  }

  @Get('api/Whitelist/changestatus/:id')
  async changeStatus(@Param('id') id: string) {
    const account = await this.repo.toggleStatus(+id);
    if (!account) return { success: false };
    return { success: true, data: null };
  }

  @Post('api/WhiteList/add')
  async add(@Body() body: any) {
    const account = await this.repo.add(body);
    return { success: true, data: { id: account.id } };
  }

  @Post('api/WhiteList/update')
  async update(@Body() body: any) {
    const account = await this.repo.update({ ...body, id: +body.id });
    if (!account) return { success: false };
    return { success: true, data: null };
  }
}
