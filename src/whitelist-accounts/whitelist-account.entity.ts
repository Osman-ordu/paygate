import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('whitelist_accounts')
export class WhitelistAccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() readableName: string;
  @Column() bankName: string;
  @Column() fullName: string;
  @Column() tcknVkn: string;
  @Column() iban: string;
  @Column({ nullable: true }) comment: string;
  @Column({ default: 1 }) status: number;
}
