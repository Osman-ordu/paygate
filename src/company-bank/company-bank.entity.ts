import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('company_banks')
export class CompanyBankEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) name: string;
  @Column({ nullable: true }) bankCode: string;
  @Column({ nullable: true }) openingTime: string;
  @Column({ nullable: true }) closingTime: string;
  @Column({ default: 1 }) status: number;
}
