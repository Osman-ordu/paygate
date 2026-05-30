import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { PermissionController } from './permission.controller';
import { RolePermissionRepository } from './role-permission.repository';
import { RoleEntity, PermissionEntity } from './role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, PermissionEntity])],
  controllers: [RoleController, PermissionController],
  providers: [RolePermissionRepository],
  exports: [RolePermissionRepository],
})
export class RolePermissionModule {}
