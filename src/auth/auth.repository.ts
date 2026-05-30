import { Injectable } from '@nestjs/common';

interface AuthUser {
  id: string;
  email: string;
}

const ALL_MODULES = [
  'Deposit', 'Withdrawal', 'TreasuryTransfer', 'TransferList',
  'Whitelist', 'InstanyBalance', 'Consensus', 'AddAccount',
  'WorkingHours', 'Integration', 'ProfileManager', 'UserManager',
  'AutoTransfer', 'LPTransfer', 'LPTransferList', 'LPBalances',
  'LPAccounts', 'LPWhiteListed', 'Refund', 'PaymentServiceManagement',
  'EODBalance',
  // pTitle aliases used directly in CDataGrid (case differs from route names)
  'LpAccounts', 'LpTransferList',
];

const FULL_PERMISSION_MODULE_INFO = ALL_MODULES.map((moduleName) => ({
  moduleName,
  permissionScore: 10,
}));

@Injectable()
export class AuthRepository {
  private pendingCodes: Map<string, string> = new Map();

  storePendingCode(email: string, code: string): void {
    this.pendingCodes.set(email, code);
  }

  getPendingCode(email: string): string | undefined {
    return this.pendingCodes.get(email);
  }

  clearPendingCode(email: string): void {
    this.pendingCodes.delete(email);
  }

  buildTokenPayload(user: AuthUser) {
    return {
      token: this.generateMockJwt(user),
      refreshToken: this.generateMockJwt(user, true),
      profileInfo: {
        moduleInfo: FULL_PERMISSION_MODULE_INFO,
      },
    };
  }

  generateMockJwt(user: AuthUser, isRefresh = false): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const exp = Math.floor(Date.now() / 1000) + (isRefresh ? 7 * 24 * 3600 : 24 * 3600);
    const payload = Buffer.from(
      JSON.stringify({ sub: user.id, email: user.email, exp }),
    ).toString('base64url');
    const signature = Buffer.from('mock-signature').toString('base64url');
    return `${header}.${payload}.${signature}`;
  }

  decodeToken(token: string): { sub: string; email: string } | null {
    try {
      const parts = token.split('.');
      return JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    } catch {
      return null;
    }
  }
}
