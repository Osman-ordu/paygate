import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('deposits')
export class DepositEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() uid: number;
  @Column() companyBankName: string;
  @Column() depositDate: string;
  @Column() receiptNo: number;
  @Column() userBankName: string;
  @Column() iban: string;
  @Column() tckn: string;
  @Column('decimal', { precision: 18, scale: 2 }) amount: number;
  @Column({ default: 'TRY' }) symbol: string;
  @Column({ default: 0 }) transactionStatus: number;
  @Column() transactionNo: string;
  @Column({ nullable: true }) depositDescriptionIade: string;
  @Column({ nullable: true }) refund: number;
  @Column({ nullable: true }) refundTransactionNo: string;
  @Column({ default: false }) masakDecRequeired: boolean;
  @Column({ default: false }) masakReport: boolean;
}
