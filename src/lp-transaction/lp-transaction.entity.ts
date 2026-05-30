import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('lp_transactions')
export class LPTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() senderLP: string;
  @Column() recipient: string;
  @Column() currency: string;
  @Column() network: string;
  @Column() walletAddress: string;
  @Column('decimal', { precision: 18, scale: 8 }) amount: number;
  @Column('decimal', { precision: 18, scale: 8, default: 0 }) fee: number;
  @Column({ nullable: true }) txid: string;
  @Column({ default: 'Pending' }) status: string;
  @Column() createTimePH: string;
  @Column({ nullable: true }) createTimeLP: string;
  @Column({ nullable: true }) transactionHash: string;
  @Column({ nullable: true }) lpId: string;
  @Column({ nullable: true }) comment: string;
}
