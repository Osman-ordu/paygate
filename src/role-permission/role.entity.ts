import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) name: string;
  @Column({ default: 1 }) status: number;
}

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() roleId: string;
  @Column() moduleId: number;
  @Column() moduleName: string;
  @Column({ default: 1 }) view: number;
  @Column({ default: 1 }) create: number;
  @Column({ default: 1 }) edit: number;
  @Column({ default: 1 }) delete: number;
  @Column({ default: 10 }) permissionScore: number;
  @Column({ nullable: true }) fieldKey: string;
}
