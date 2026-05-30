# AUTH_GUIDE.md — Gerçek Auth Mimarisine Geçiş Rehberi

Bu döküman, mock/in-memory auth yapısından gerçek PostgreSQL + JWT tabanlı auth mimarisine geçişte
yapılması gereken adımları açıklar.

---

## 1. Mevcut Mock Yapısı (Şu An Çalışan)

| Bileşen          | Mock Davranışı                                                       |
| ---------------- | -------------------------------------------------------------------- |
| Şifre doğrulama  | Düz metin karşılaştırma (`user.password === inputPassword`)          |
| 2FA kodu         | Her zaman `123456` kabul edilir                                      |
| JWT token        | Sahte (base64url ile oluşturulmuş), `exp` alanı var ama imzalanmamış |
| Kullanıcı verisi | `auth.repository.ts` içindeki in-memory array                        |
| Permission       | Tüm modüller için `permissionScore: 10` (full access) döndürülür     |

---

## 2. Gerçek Auth'a Geçiş Adımları

### Adım 1 — Bağımlılıkları Ekle

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

### Adım 2 — Prisma Şeması

```prisma
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  password    String   // bcrypt hash
  name        String
  surname     String
  phoneNumber String
  roleId      String
  status      Int      @default(1)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  role        Role     @relation(fields: [roleId], references: [id])
}

model Role {
  id          String       @id @default(uuid())
  name        String       @unique
  status      Int          @default(1)
  users       User[]
  permissions Permission[]
}

model Permission {
  id              String @id @default(uuid())
  roleId          String
  moduleName      String
  permissionScore Int    @default(0)

  role Role @relation(fields: [roleId], references: [id])
}
```

### Adım 3 — auth.repository.ts Değişiklikleri

```typescript
// Şifre karşılaştırmayı bcrypt ile yap:
import * as bcrypt from 'bcrypt';

async validatePassword(input: string, hash: string): Promise<boolean> {
  return bcrypt.compare(input, hash);
}

async hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// findByEmail artık Prisma'ya gidecek:
async findByEmail(email: string) {
  return this.prisma.user.findUnique({ where: { email } });
}
```

### Adım 4 — JWT Modülünü Aktif Et

```typescript
// auth.module.ts
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  ...
})
```

```typescript
// auth.service.ts
async verifyCode(email: string, code: string) {
  // Gerçek 2FA (Google Authenticator / e-posta OTP) doğrulama
  const isValid = await this.twoFactorService.verify(email, code);
  if (!isValid) throw new UnauthorizedException();

  const user = await this.authRepository.findByEmail(email);
  const token = this.jwtService.sign({ sub: user.id, email: user.email });
  const refreshToken = this.jwtService.sign(
    { sub: user.id },
    { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET }
  );

  // Permission'ları veritabanından çek
  const permissions = await this.permissionRepository.findByRoleId(user.roleId);

  return {
    data: {
      token,
      refreshToken,
      profileInfo: {
        moduleInfo: permissions.map(p => ({
          moduleName: p.moduleName,
          permissionScore: p.permissionScore,
        })),
      },
    }
  };
}
```

### Adım 5 — JWT Guard'ı Aktif Et

```typescript
// src/common/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

```typescript
// src/common/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

```typescript
// Her controller'ın korumalı route'larına ekle:
@UseGuards(JwtAuthGuard)
@Get('protected-route')
async protectedRoute(@Request() req) {
  return req.user; // { userId, email }
}
```

### Adım 6 — refreshToken Endpoint'i

```typescript
// 401 response aldığında frontend bu endpoint'i çağırır
async refreshToken(token: string, refreshToken: string) {
  try {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    const user = await this.authRepository.findById(payload.sub);
    const newToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token: newToken, refreshToken }; // refresh token'ı yenilemeye gerek yok
  } catch {
    throw new UnauthorizedException('Refresh token expired'); // 498 döndür
  }
}
```

> **Frontend Notu:** `services/index.ts` dosyasında `status 401` → `refreshToken` çağrısı, `status 498` → localStorage temizleme + `/auth/login`'e yönlendirme vardır. 498 için NestJS'de custom exception filter yaz.

---

## 3. Permission Sistemi (Frontend Mantığı)

Frontend, `permissionScore` değerini şöyle yorumlar:

| Score | Anlamı                                     |
| ----- | ------------------------------------------ |
| 0     | Modüle erişim yok                          |
| 1     | Sadece görüntüleme                         |
| 3     | Görüntüleme + Oluşturma                    |
| 5     | Görüntüleme + Düzenleme                    |
| 7     | Görüntüleme + Oluşturma + Düzenleme        |
| 10    | Tam erişim (view + create + edit + delete) |

Deposit sayfasındaki örnek:

```typescript
// editTrue: düzenleme butonlarını göster/gizle
const editTrue = new Set([4, 6, 8, 10]).has(pScore);
```

Backend'de bu score'ları bitwise olarak sakla: `view=1, create=2, edit=4, delete=8`.

---

## 4. 2FA Entegrasyonu

### Seçenek A: Google Authenticator (TOTP)

```bash
npm install @otplib/preset-default
```

### Seçenek B: E-posta OTP

- Kullanıcı login yaptığında rastgele 6 haneli kod üret
- Kodu Redis'e 5 dakika TTL ile kaydet
- E-posta servis (Nodemailer / SendGrid) ile gönder

---

## 5. .env Değişkenleri (Gerçek Ortam)

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/core_crud_db"

# JWT
JWT_SECRET=your-super-secret-key-minimum-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-minimum-32-chars
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# Email (2FA için)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASS=your-smtp-password
```
