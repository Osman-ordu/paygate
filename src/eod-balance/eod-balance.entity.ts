import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('eod_balances')
export class EODBalanceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) symbol: string;
  @Column('decimal', { precision: 18, scale: 2, default: 0 }) client: number;
  @Column('decimal', { precision: 18, scale: 2, default: 0 }) clientUSDT: number;
  @Column('decimal', { precision: 18, scale: 2, default: 0 }) custody: number;
  @Column('decimal', { precision: 18, scale: 2, default: 0 }) custodyUSDT: number;
  @Column('decimal', { precision: 18, scale: 2, default: 0 }) lp: number;
  @Column('decimal', { precision: 18, scale: 2, default: 0 }) lpusdt: number;
  @Column('decimal', { precision: 18, scale: 2, default: 0 }) bank: number;
  @Column('decimal', { precision: 18, scale: 2, default: 0 }) bankUSDT: number;
  @Column('decimal', { precision: 18, scale: 2, default: 0 }) company: number;
  @Column('decimal', { precision: 18, scale: 2, default: 0 }) companyUSDT: number;
  @Column('decimal', { precision: 18, scale: 2, default: 0 }) clientvsCompany: number;
  @Column('decimal', { precision: 10, scale: 4, default: 1 }) dcr: number;
  @Column() lastUpdatedAt: string;
  @Column({ default: 'system' }) lastUpdatedBy: string;
}
