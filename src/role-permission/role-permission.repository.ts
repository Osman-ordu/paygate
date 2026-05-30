import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity, PermissionEntity } from './role.entity';

const MODULES = [
  { moduleId: 1,  moduleName: 'Deposit' },
  { moduleId: 2,  moduleName: 'Withdrawal' },
  { moduleId: 3,  moduleName: 'TreasuryTransfer' },
  { moduleId: 4,  moduleName: 'TransferList' },
  { moduleId: 5,  moduleName: 'Whitelist' },
  { moduleId: 6,  moduleName: 'InstanyBalance' },
  { moduleId: 7,  moduleName: 'Consensus' },
  { moduleId: 8,  moduleName: 'AddAccount' },
  { moduleId: 9,  moduleName: 'WorkingHours' },
  { moduleId: 10, moduleName: 'Integration' },
  { moduleId: 11, moduleName: 'ProfileManager' },
  { moduleId: 12, moduleName: 'UserManager' },
  { moduleId: 13, moduleName: 'AutoTransfer' },
  { moduleId: 14, moduleName: 'LPTransfer' },
  { moduleId: 15, moduleName: 'LPTransferList' },
  { moduleId: 16, moduleName: 'LPBalances' },
  { moduleId: 17, moduleName: 'LPAccounts' },
  { moduleId: 18, moduleName: 'LPWhiteListed' },
  { moduleId: 19, moduleName: 'Refund' },
  { moduleId: 20, moduleName: 'PaymentServiceManagement' },
  { moduleId: 21, moduleName: 'EODBalance' },
];

@Injectable()
export class RolePermissionRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permRepo: Repository<PermissionEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.roleRepo.count();
    if (count > 0) return;

    const roles = await this.roleRepo.save([
      { name: 'Super Admin', status: 1 },
      { name: 'Operator',    status: 1 },
      { name: 'Viewer',      status: 1 },
    ]);

    const superAdmin = roles.find((r) => r.name === 'Super Admin')!;
    const perms = MODULES.map((m) => ({
      roleId: superAdmin.id,
      moduleId: m.moduleId,
      moduleName: m.moduleName,
      view: 1, create: 1, edit: 1, delete: 1,
      permissionScore: 10,
      fieldKey: m.moduleName,
    }));
    await this.permRepo.save(perms);
  }

  async findAllRoles(): Promise<RoleEntity[]> {
    return this.roleRepo.find();
  }

  async findRoleById(id: string): Promise<RoleEntity | null> {
    return this.roleRepo.findOne({ where: { id } });
  }

  async addRole(name: string): Promise<RoleEntity> {
    const role = await this.roleRepo.save({ name, status: 1 });
    const perms = MODULES.map((m) => ({
      roleId: role.id,
      moduleId: m.moduleId,
      moduleName: m.moduleName,
      view: 0, create: 0, edit: 0, delete: 0,
      permissionScore: 0,
      fieldKey: m.moduleName,
    }));
    await this.permRepo.save(perms);
    return role;
  }

  async updateRole(id: string, name: string): Promise<RoleEntity | null> {
    await this.roleRepo.update(id, { name });
    return this.findRoleById(id);
  }

  async toggleRoleStatus(id: string): Promise<RoleEntity | null> {
    const role = await this.findRoleById(id);
    if (!role) return null;
    await this.roleRepo.update(id, { status: role.status === 1 ? 0 : 1 });
    return this.findRoleById(id);
  }

  getModules() {
    return MODULES;
  }

  async getAllPermissions(): Promise<any[]> {
    const roles = await this.roleRepo.find();
    return Promise.all(
      roles.map(async (role) => ({
        roleId: role.id,
        roleName: role.name,
        permissions: await this.permRepo.find({ where: { roleId: role.id } }),
      })),
    );
  }

  async getPermissionsByRole(roleId: string): Promise<PermissionEntity[]> {
    return this.permRepo.find({ where: { roleId } });
  }

  async updatePermissions(roleId: string, permissions: { moduleId: number; permissionScore: number }[]): Promise<void> {
    for (const { moduleId, permissionScore } of permissions) {
      const perm = await this.permRepo.findOne({ where: { roleId, moduleId } });
      if (perm) {
        await this.permRepo.update(perm.id, {
          permissionScore,
          view:   (permissionScore & 1) ? 1 : 0,
          create: (permissionScore & 2) ? 1 : 0,
          edit:   (permissionScore & 4) ? 1 : 0,
          delete: (permissionScore & 8) ? 1 : 0,
        });
      }
    }
  }
}
