import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { RolePermissionRepository } from './role-permission.repository';

@Controller('api/Permission')
export class PermissionController {
  constructor(private readonly repo: RolePermissionRepository) {}

  @Get()
  async getAll() {
    return { data: await this.repo.getAllPermissions() };
  }

  @Get('getmodules')
  getModules() {
    return { data: this.repo.getModules() };
  }

  @Get(':profileId')
  async getByRole(@Param('profileId') profileId: string) {
    return { data: await this.repo.getPermissionsByRole(profileId) };
  }

  @Put()
  async updatePermissions(
    @Body() body: { roleId: string; permissions: { moduleId: number; permissionScore: number }[] },
  ) {
    await this.repo.updatePermissions(body.roleId, body.permissions);
    return { success: true, data: null };
  }
}
