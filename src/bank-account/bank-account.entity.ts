import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bank_accounts')
export class BankAccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true }) companyBankId: string;
  @Column() companyBankName: string;
  @Column({ default: 'TRY' }) currency: string;
  @Column() iban: string;
  @Column() accountName: string;
  @Column({ nullable: true }) accountNo: string;
  @Column({ nullable: true }) accountHolderName: string;
  @Column({ nullable: true }) vkn: string;
  @Column({ default: 1 }) priority: number;
  @Column({ default: 1 }) status: number;
  @Column({ nullable: true }) accountType: number;
  @Column('decimal', { precision: 18, scale: 2, default: 0 }) balance: number;
  @Column('decimal', { precision: 18, scale: 2, default: 0 }) availableBalance: number;
}
