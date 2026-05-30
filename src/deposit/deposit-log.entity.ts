import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('deposit_logs')
export class DepositLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text') request: string;
  @Column('text') response: string;
}
