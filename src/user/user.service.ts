import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getList() {
    const users = await this.userRepository.findAll();
    const data = users.map(({ password, ...u }) => u);
    return { data };
  }

  async editUser(body: {
    id: string;
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    roleId: string;
  }) {
    const user = await this.userRepository.update(body.id, {
      name: body.name,
      surname: body.surname,
      email: body.email,
      phoneNumber: body.phoneNumber,
    });
    if (!user) throw new NotFoundException('User not found');
    return { success: true, data: null };
  }

  async changeStatus(id: string) {
    const user = await this.userRepository.toggleStatus(id);
    if (!user) throw new NotFoundException('User not found');
    return { success: true, data: null };
  }

  async resetGoogleAuth(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return { success: true, data: null };
  }
}
