import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '../models/user-rule.enum';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userWithSameEmail) {
      throw new ConflictException('Email already exists');
    }

    return this.prisma.user.create({
      data: {
        ...data,
        role: data.role ?? UserRole.COMMON,
      },
    });
  }

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: string): Promise<User> {
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: parsedId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(
    adminId: string,
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    const adminUser = await this.getUserById(adminId);

    if (adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update users');
    }

    const userToUpdate = await this.getUserById(id);

    if (userToUpdate.role === UserRole.ADMIN) {
      throw new ConflictException('Admin cannot be changed');
    }

    return this.prisma.user.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async deleteUser(adminId: string, id: string): Promise<User> {
    const adminUser = await this.getUserById(adminId);

    if (adminUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete users');
    }

    const userToDelete = await this.getUserById(id);

    if (!userToDelete) {
      throw new NotFoundException('User not found');
    }

    if (userToDelete.role === UserRole.ADMIN) {
      throw new ConflictException('Admin cannot be deleted');
    }

    return this.prisma.user.delete({
      where: { id: parseInt(id, 10) },
    });
  }
}
