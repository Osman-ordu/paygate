import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('quick_transactions')
export class QuickTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() senderId: number;
  @Column() senderAccountName: string;
  @Column() recipientId: number;
  @Column() recipientName: string;
  @Column({ default: 1 }) transferType: number;
  @Column({ default: 1 }) numberOfTransfers: number;
  @Column('decimal', { precision: 18, scale: 2 }) eachTransferAmount: number;
  @Column({ nullable: true }) description: string;
  @Column({ nullable: true }) comment: string;
  @Column({ default: 'Pending' }) status: string;
  @Column() createdAt: string;
}
