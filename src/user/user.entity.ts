import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() name: string;
  @Column() surname: string;
  @Column({ unique: true }) email: string;
  @Column() phoneNumber: string;
  @Column() password: string;
  @Column({ default: 'User' }) profileName: string;
  @Column({ default: 1 }) status: number;
  @Column({ nullable: true }) roleId: string;
  @Column({ nullable: true }) totpSecret: string;
  @Column({ default: false }) pendingApproval: boolean;

  @CreateDateColumn() createdAt: Date;
}
