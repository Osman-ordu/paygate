import { Controller, Post, Put, Body, Query, Req, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('newLogin')
  @HttpCode(200)
  async newLogin(@Body() body: { email: string; password: string }) {
    return this.authService.newLogin(body.email, body.password);
  }

  @Post('verifyCode')
  @HttpCode(200)
  async verifyCode(@Body() body: { email: string; code: string }) {
    return this.authService.verifyCode(body.email, body.code);
  }

  @Post('refreshToken')
  @HttpCode(200)
  async refreshToken(@Body() body: { token: string; refreshToken: string }) {
    return this.authService.refreshToken(body.token, body.refreshToken);
  }

  @Post('register')
  @HttpCode(200)
  async register(
    @Body()
    body: {
      name: string;
      surname: string;
      email: string;
      phoneNumber: string;
      password: string;
      roleId: string;
    },
  ) {
    return this.authService.register(body);
  }

  @Post('reset')
  @HttpCode(200)
  async changePassword(
    @Body() body: { oldPassword: string; newPassword: string },
    @Req() req: any,
  ) {
    const token = (req.headers['authorization'] || '').replace('Bearer ', '');
    const userId = this.authService.getUserIdFromToken(token);
    return this.authService.changePassword(userId, body.oldPassword, body.newPassword);
  }
}
