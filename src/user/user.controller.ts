import { Controller, Get, Put, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getlist')
  async getList() {
    return this.userService.getList();
  }

  @Get('all')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('pending')
  async getPending() {
    return this.userService.getPending();
  }

  @Get('pending-count')
  async getPendingCount() {
    return this.userService.getPendingCount();
  }

  @Put('approve')
  async approveUser(@Query('id') id: string) {
    return this.userService.approveUser(id);
  }

  @Put('reject')
  async rejectUser(@Query('id') id: string) {
    return this.userService.rejectUser(id);
  }

  @Put('resend-approval')
  async resendApproval(@Query('id') id: string) {
    return this.userService.resendApproval(id);
  }

  @Put('set-status')
  async setStatus(@Query('id') id: string, @Query('enabled') enabled: string) {
    return this.userService.setStatus(id, enabled === 'true');
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
