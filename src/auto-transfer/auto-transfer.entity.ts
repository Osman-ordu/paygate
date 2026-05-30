import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('auto_transfers')
export class AutoTransferEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() withdrawAccount: string;
  @Column() depositAccount: string;
  @Column('decimal', { precision: 18, scale: 2 }) maintenanceBalance: number;
  @Column('decimal', { precision: 18, scale: 2 }) topUpBalance: number;
  @Column({ default: 1 }) prioritization: number;
  @Column({ default: 1 }) status: number;
}

@Entity('auto_transfer_transactions')
export class AutoTransferTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() timestamp: string;
  @Column() depositAccount: string;
  @Column() withdrawAccount: string;
  @Column('decimal', { precision: 18, scale: 2 }) amount: number;
  @Column({ default: 'Completed' }) status: string;
  @Column({ nullable: true }) errorMessage: string;
}
