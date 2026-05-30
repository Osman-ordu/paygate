import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getList() {
    const users = await this.userRepository.findAll();
    const data = users.map(({ password, totpSecret, ...u }) => u);
    return { data };
  }

  async getPending() {
    const users = await this.userRepository.findPending();
    const data = users.map(({ password, totpSecret, ...u }) => u);
    return { success: true, data };
  }

  async getPendingCount() {
    const count = await this.userRepository.countPending();
    return { success: true, data: count };
  }

  async getAllUsers() {
    const users = await this.userRepository.findAllUsers();
    const data = users.map(({ password, totpSecret, ...u }) => u);
    return { success: true, data };
  }

  async rejectUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.userRepository.update(id, { pendingApproval: false, status: 0 });
    return { success: true, data: null };
  }

  async resendApproval(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    let secret = user.totpSecret;
    if (!secret) {
      secret = authenticator.generateSecret();
      await this.userRepository.update(id, { totpSecret: secret });
    }

    const otpAuthUrl = authenticator.keyuri(user.email, 'CepteCash', secret);
    const qrDataUrl = await QRCode.toDataURL(otpAuthUrl);
    const qrBase64 = qrDataUrl.replace('data:image/png;base64,', '');

    await this.sendQrApprovalMail(user.email, user.name, qrBase64);
    return { success: true, data: null };
  }

  async setStatus(id: string, enabled: boolean) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await this.userRepository.update(id, { status: enabled ? 1 : 0 });
    return { success: true, data: null };
  }

  async approveUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(user.email, 'CepteCash', secret);
    const qrDataUrl = await QRCode.toDataURL(otpAuthUrl);
    const qrBase64 = qrDataUrl.replace('data:image/png;base64,', '');

    await this.userRepository.update(id, {
      totpSecret: secret,
      pendingApproval: false,
      status: 1,
    });

    await this.sendQrApprovalMail(user.email, user.name, qrBase64);

    return { success: true, data: null };
  }

  async editUser(body: {
    id: string;
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    roleId: string;
  }) {
    const user = await this.userRepository.update(body.id, {
      name: body.name,
      surname: body.surname,
      email: body.email,
      phoneNumber: body.phoneNumber,
    });
    if (!user) throw new NotFoundException('User not found');
    return { success: true, data: null };
  }

  async changeStatus(id: string) {
    const user = await this.userRepository.toggleStatus(id);
    if (!user) throw new NotFoundException('User not found');
    return { success: true, data: null };
  }

  async resetGoogleAuth(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(user.email, 'CepteCash', secret);
    const qrDataUrl = await QRCode.toDataURL(otpAuthUrl);
    const qrBase64 = qrDataUrl.replace('data:image/png;base64,', '');

    await this.userRepository.update(id, { totpSecret: secret });

    return { success: true, data: qrBase64 };
  }

  private async sendQrApprovalMail(to: string, userName: string, qrBase64: string) {
    const mailGatewayUrl = process.env.MAIL_GATEWAY_URL;
    const mailGatewayKey = process.env.MAIL_GATEWAY_API_KEY;

    if (!mailGatewayUrl || !mailGatewayKey) {
      console.warn('MAIL_GATEWAY_URL or MAIL_GATEWAY_API_KEY not configured — skipping email');
      return;
    }

    try {
      const res = await fetch(`${mailGatewayUrl}/send/qr-approval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': mailGatewayKey,
        },
        body: JSON.stringify({ to, userName, qrBase64 }),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Mail gateway error ${res.status}: ${body}`);
      }
    } catch (err) {
      throw new InternalServerErrorException(`Onay e-postası gönderilemedi: ${err.message}`);
    }
  }
}
