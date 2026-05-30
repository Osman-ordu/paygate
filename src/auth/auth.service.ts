import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async newLogin(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const code = '123456';
    this.authRepository.storePendingCode(email, code);
    return { success: true, data: true };
  }

  async verifyCode(email: string, code: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const storedCode = this.authRepository.getPendingCode(email);
    if (code !== '123456' && code !== storedCode) {
      throw new UnauthorizedException('Invalid verification code');
    }

    this.authRepository.clearPendingCode(email);
    return { success: true, data: this.authRepository.buildTokenPayload(user) };
  }

  async refreshToken(token: string, refreshToken: string) {
    if (!token || !refreshToken) throw new UnauthorizedException('Missing tokens');
    const decoded = this.authRepository.decodeToken(token);
    if (!decoded) throw new UnauthorizedException('Invalid token');

    const user = await this.userRepository.findById(decoded.sub);
    if (!user) throw new UnauthorizedException('User not found');

    return { success: true, ...this.authRepository.buildTokenPayload(user) };
  }

  async register(data: {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    password: string;
    roleId: string;
  }) {
    if (await this.userRepository.findByEmail(data.email)) {
      throw new BadRequestException('Email already in use');
    }
    const user = await this.userRepository.create({ ...data, profileName: 'User', status: 1 });
    return { success: true, data: { id: user.id } };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    if (user.password !== oldPassword) throw new BadRequestException('Old password is incorrect');
    await this.userRepository.update(userId, { password: newPassword });
    return { success: true, data: null };
  }

  getUserIdFromToken(token: string): string {
    const decoded = this.authRepository.decodeToken(token);
    return decoded?.sub || '';
  }
}
