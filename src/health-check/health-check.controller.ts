import { Controller, Get } from '@nestjs/common';

@Controller('api/ServerHealthCheck')
export class HealthCheckController {
  @Get()
  check() {
    return {
      success: true,
      data: [
        { ZiraatDepositService: true },
        { VakifbankDepositService: true },
        { WithdrawalService: true },
        { BinanceTrLPService: false },
        { OkxLPService: true },
        { ChainUpExchangeService: true },
      ],
    };
  }
}
