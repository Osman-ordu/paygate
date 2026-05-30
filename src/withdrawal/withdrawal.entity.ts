import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('withdrawals')
export class WithdrawalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() uid: number;
  @Column() companyBankName: string;
  @Column() withdrawDate: string;
  @Column() recordId: string;
  @Column() channel: string;
  @Column() bankName: string;
  @Column() iban: string;
  @Column() tckn: string;
  @Column('decimal', { precision: 18, scale: 2 }) amount: number;
  @Column({ default: 'TRY' }) symbol: string;
  @Column({ default: 2 }) transactionStatus: number;
  @Column({ nullable: true }) withdrawDescription: string;
}
