import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.user.update({
      where: { id: id },
      data,
    });
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
