import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('treasury_transfers')
export class TreasuryTransferEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() fromAccountId: number;
  @Column() toAccountId: number;
  @Column('decimal', { precision: 18, scale: 2 }) amount: number;
  @Column({ default: 'TRY' }) currency: string;
  @Column({ nullable: true }) description: string;
  @Column({ default: false }) isManual: boolean;
  @Column({ default: 'Pending' }) status: string;
  @Column() createdAt: string;
}
