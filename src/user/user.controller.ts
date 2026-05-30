import { Controller, Get, Put, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getlist')
  async getList() {
    return this.userService.getList();
  }

  @Put()
  async editUser(
    @Body()
    body: {
      id: string;
      name: string;
      surname: string;
      email: string;
      phoneNumber: string;
      roleId: string;
    },
  ) {
    return this.userService.editUser(body);
  }

  @Put('change-status')
  async changeStatus(@Query('id') id: string) {
    return this.userService.changeStatus(id);
  }

  @Put('reset')
  async resetGoogleAuth(@Query('id') id: string) {
    return this.userService.resetGoogleAuth(id);
  }
}
