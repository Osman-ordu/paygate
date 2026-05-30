import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('treasury_accounts')
export class TreasuryAccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() companyBankName: string;
  @Column() accountName: string;
  @Column() iban: string;
  @Column() bankName: string;
  @Column({ default: 'TRY' }) currency: string;
  @Column('decimal', { precision: 18, scale: 2, default: 0 }) balance: number;
}
