import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('lp_accounts')
export class LPAccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() lpName: string;
  @Column() accountCurrency: string;
  @Column({ default: 'Active' }) accountStatus: string;
}

@Entity('lp_account_wallets')
export class LPAccountWalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() lpNameId: string;
  @Column() currencyNetwork: string;
  @Column() accountId: string;
}
