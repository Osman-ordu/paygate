import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sub_transfers')
export class SubTransferEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() bankName: string;
  @Column() stTransferDate: string;
  @Column() stTransactionNo: string;
  @Column('decimal', { precision: 18, scale: 2 }) stAmount: number;
  @Column() stTransferStatus: string;
  @Column({ nullable: true }) stTransactionDescription: string;
  @Column() ttId: string;
  @Column() ttTransferDate: string;
  @Column({ nullable: true }) ttComment: string;
  @Column() ttBankName: string;
  @Column() ttIban: string;
  @Column() ttFullName: string;
  @Column() ttStatus: string;
  @Column() updateDate: string;
  @Column() transferredBy: string;
  @Column() transferType: string;
}

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() type: string;
  @Column('decimal', { precision: 18, scale: 2 }) amount: number;
  @Column({ default: 'TRY' }) currency: string;
  @Column() fromAccount: string;
  @Column() toAccount: string;
  @Column({ default: 'Pending' }) status: string;
  @Column() referenceNo: string;
  @Column() createdAt: string;
}
