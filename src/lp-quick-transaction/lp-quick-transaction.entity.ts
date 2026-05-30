import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('lp_quick_transactions')
export class LPQuickTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() senderLP: string;
  @Column() senderLPCurrency: string;
  @Column() recipient: string;
  @Column() recipientCurrency: string;
  @Column('decimal', { precision: 18, scale: 2 }) transferAmount: number;
  @Column() network: string;
  @Column() walletAddress: string;
  @Column() channel: string;
  @Column({ nullable: true }) entityType: string;
  @Column({ nullable: true }) vaspName: string;
  @Column({ nullable: true }) coporateName: string;
  @Column({ nullable: true }) comment: string;
  @Column({ default: 'Pending' }) status: string;
  @Column() createdAt: string;
}
