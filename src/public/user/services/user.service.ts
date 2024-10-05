import {
  ConflictException,
  Injectable,
  NotFoundException,
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

  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    const userToUpdate = await this.getUserById(id);

    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: id },
      data,
    });
  }

  async deleteUser(id: number): Promise<User> {
    const userToDelete = await this.getUserById(id);

    if (!userToDelete) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.delete({
      where: { id: id },
    });
  }
}
