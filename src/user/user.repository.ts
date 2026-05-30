import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) return;
    await this.repo.save([
      {
        email: 'admin@admin.com',
        password: 'Admin123!',
        name: 'Admin',
        surname: 'User',
        phoneNumber: '05001234567',
        profileName: 'Super Admin',
        status: 1,
      },
      {
        email: 'operator@admin.com',
        password: 'Oper123!',
        name: 'Operator',
        surname: 'Smith',
        phoneNumber: '05009876543',
        profileName: 'Super Admin',
        status: 1,
      },
    ]);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.repo.find({ where: { pendingApproval: false } });
  }

  async findPending(): Promise<UserEntity[]> {
    return this.repo.find({ where: { pendingApproval: true }, order: { createdAt: 'DESC' } });
  }

  async countPending(): Promise<number> {
    return this.repo.count({ where: { pendingApproval: true } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async toggleStatus(id: string): Promise<UserEntity | null> {
    const user = await this.findById(id);
    if (!user) return null;
    return this.update(id, { status: user.status === 1 ? 0 : 1 });
  }
}
