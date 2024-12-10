import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/public/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async updateUser(
    id: number,
    data: Prisma.UserUpdateInput,
  ): Promise<User | null> {
    const userToUpdate = await this.getUserById(id);

    if (!userToUpdate) {
      return null;
    }

    if (data.password) {
      data.password = this.authService.encryptPassword(String(data.password));
    }

    return this.prisma.user.update({
      where: { id: id },
      data,
    });
  }

  async createUser(data: Prisma.UserCreateInput[]): Promise<void> {
     if (data.length === 0) {
       throw new Error('No user data provided for creation.');
     }
    
    for (const user of data) {
      await this.prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          password: user.password,
          birthAt: user.birthAt || undefined,
          createdAt: user.createdAt || undefined,
          rule: user.rule || [],
        },
        create: {
          email: user.email,
          name: user.name,
          password: user.password,
          birthAt: user.birthAt || undefined,
          createdAt: user.createdAt || undefined,
          rule: user.rule || [],
        },
      });
    }
  }

  async deleteUser(id: number): Promise<User | null> {
    const userToDelete = await this.getUserById(id);

    if (!userToDelete) {
      return null;
    }

    return this.prisma.user.delete({
      where: { id: id },
    });
  }
}
