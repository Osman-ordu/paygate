import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('lp_whitelist')
export class LPWhitelistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() accountName: string;
  @Column() lpName: string;
  @Column() currency: string;
  @Column() walletAddress: string;
  @Column() network: string;
  @Column({ nullable: true }) memoTag: string;
  @Column({ default: 'Crypto' }) channel: string;
  @Column({ nullable: true }) vaspName: string;
  @Column({ nullable: true }) targetType: string;
  @Column({ nullable: true }) innerToType: string;
  @Column({ nullable: true }) entity: string;
  @Column({ nullable: true }) name: string;
  @Column({ nullable: true }) surname: string;
  @Column({ nullable: true }) birthdate: string;
  @Column({ nullable: true }) corporateName: string;
  @Column({ nullable: true }) corporateAddress: string;
  @Column({ nullable: true }) description: string;
  @Column({ nullable: true }) country: string;
  @Column({ nullable: true }) city: string;
  @Column({ nullable: true }) district: string;
  @Column({ nullable: true }) streetName: string;
  @Column({ default: 2 }) status: number;
}
