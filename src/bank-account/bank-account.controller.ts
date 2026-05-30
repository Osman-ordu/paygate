import { Controller, Get, Post, Put, Body } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';

@Controller('api/BankAccount')
export class BankAccountController {
  constructor(private readonly service: BankAccountService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Put()
  update(@Body() body: any) {
    return this.service.update(body);
  }

  @Get('details')
  getDetails() {
    return this.service.getDetails();
  }

  @Get('accountList')
  getAccountList() {
    return this.service.getAccountList();
  }

  @Get('priorities')
  getPriorities() {
    return this.service.getPriorities();
  }

  @Post('consensus')
  getConsensus(
    @Body() body: { currency: string; startDate: string; endDate: string },
  ) {
    return this.service.getConsensus(body);
  }
}
