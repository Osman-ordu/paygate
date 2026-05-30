import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('withdrawal_logs')
export class WithdrawalLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text') request: string;
  @Column('text') response: string;
}
