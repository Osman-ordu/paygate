import { Controller, Get, Post, Put, Body, Query } from '@nestjs/common';
import { RolePermissionRepository } from './role-permission.repository';

@Controller('api/Role')
export class RoleController {
  constructor(private readonly repo: RolePermissionRepository) {}

  @Get()
  async findAll() {
    return { data: await this.repo.findAllRoles() };
  }

  @Post()
  async create(@Body() body: { name: string }) {
    const role = await this.repo.addRole(body.name);
    return { success: true, data: { id: role.id } };
  }

  @Put()
  async update(@Body() body: { id: string; name: string }) {
    const role = await this.repo.updateRole(body.id, body.name);
    if (!role) return { success: false };
    return { success: true, data: null };
  }

  @Put('changeStatus')
  async changeStatus(@Query('roleId') roleId: string) {
    const role = await this.repo.toggleRoleStatus(roleId);
    if (!role) return { success: false };
    return { success: true, data: null };
  }
}
