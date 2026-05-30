import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('credentials')
export class CredentialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) type: string;
  @Column({ nullable: true }) realSenderName: string;
  @Column({ nullable: true }) accountNo: string;
  @Column({ nullable: true }) apiUrl: string;
  @Column({ nullable: true }) secondApiUrl: string;
  @Column({ nullable: true }) customerNo: string;
  @Column({ nullable: true }) userName: string;
  @Column({ nullable: true }) password: string;
  @Column({ nullable: true }) tosUserName: string;
  @Column({ nullable: true }) tosPassword: string;
  @Column({ nullable: true }) apiKey: string;
  @Column({ nullable: true }) secretKey: string;
  @Column({ nullable: true }) passPhrase: string;
}

@Entity('services')
export class ServiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) serviceName: string;
  @Column({ nullable: true }) workFrequency: number;
  @Column({ default: true }) status: boolean;
  @Column({ nullable: true }) lastUpdateBy: string;
  @Column({ nullable: true }) lastUpdateAt: string;
  @Column({ default: 'BANKS' }) integrationType: string;
}
