import {
  ForbiddenException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../models/user-rule.enum';
import { UserService } from '../services/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    prismaService = {
      user: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    } as unknown as PrismaService;

    service = new UserService(prismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateUser', () => {
    it('should allow an admin to update a user', async () => {
      const adminUser = {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
        role: UserRole.ADMIN,
      };

      const userToUpdate = {
        id: 2,
        email: 'user@example.com',
        name: 'Test User',
        role: UserRole.COMMON,
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(
        adminUser,
      );
      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(
        userToUpdate,
      );
      (prismaService.user.update as jest.Mock).mockResolvedValue(userToUpdate);

      const result = await service.updateUser('1', '2', {
        email: 'updated@example.com',
      });

      expect(result).toEqual(userToUpdate);
    });

    it('should throw ForbiddenException if non-admin tries to update a user', async () => {
      const nonAdminUser = {
        id: 1,
        email: 'user@example.com',
        name: 'Non-admin User',
        role: UserRole.COMMON,
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(
        nonAdminUser,
      );

      await expect(
        service.updateUser('1', '2', { email: 'updated@example.com' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteUser', () => {
    it('should allow an admin to delete a user', async () => {
      const adminUser = {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
        role: UserRole.ADMIN,
      };

      const userToDelete = {
        id: 2,
        email: 'user@example.com',
        name: 'Test User',
        role: UserRole.COMMON,
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(
        adminUser,
      );
      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(
        userToDelete,
      );
      (prismaService.user.delete as jest.Mock).mockResolvedValue(userToDelete);

      const result = await service.deleteUser('1', '2');

      expect(result).toEqual(userToDelete);
    });

    it('should throw ForbiddenException if non-admin tries to delete a user', async () => {
      const nonAdminUser = {
        id: 1,
        email: 'user@example.com',
        name: 'Non-admin User',
        role: UserRole.COMMON,
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(
        nonAdminUser,
      );

      await expect(service.deleteUser('1', '2')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException if the user to be deleted is not found', async () => {
      const adminUser = {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
        role: UserRole.ADMIN,
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(
        adminUser,
      );

      (prismaService.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.deleteUser('1', '2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
