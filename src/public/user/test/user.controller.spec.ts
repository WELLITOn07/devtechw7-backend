import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../_controllers/user.controller';
import { UserService } from '../_services/user.service';
import { AuthGuard } from 'src/public/auth/_guards/auth.guard';
import { RuleAccessGuard } from 'src/public/auth/_guards/rule-access.guard';
import {
  NotFoundException,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUsers: jest.fn(),
    deleteUser: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRuleAccessGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RuleAccessGuard)
      .useValue(mockRuleAccessGuard)
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should retrieve all users', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
      ];
      mockUserService.getUsers.mockResolvedValue(mockUsers);

      const result = await controller.getUsers();

      expect(userService.getUsers).toHaveBeenCalled();
      expect(result).toEqual({
        statusCode: 200,
        message: 'Users retrieved successfully',
        data: mockUsers,
      });
    });

    it('should throw NotFoundException if no users are found', async () => {
      mockUserService.getUsers.mockResolvedValue(null);

      await expect(controller.getUsers()).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserById', () => {
    it('should retrieve a user by ID', async () => {
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
      mockUserService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getUserById(1);

      expect(userService.getUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        statusCode: 200,
        message: `User with ID 1 retrieved successfully`,
        data: mockUser,
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserService.getUserById.mockResolvedValue(null);

      await expect(controller.getUserById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUsers', () => {
    it('should create users', async () => {
      const mockUsers: Prisma.UserCreateInput[] = [
        {
          email: 'john@example.com',
          name: 'John Doe',
          password: 'password123',
        },
      ];

      mockUserService.createUser.mockResolvedValue(undefined);

      const result = await controller.createUsers(mockUsers);

      expect(userService.createUser).toHaveBeenCalledWith(mockUsers);
      expect(result).toEqual({
        statusCode: 201,
        message: '1 user(s) created successfully.',
      });
    });

    it('should throw HttpException on creation failure', async () => {
      const mockUsers: Prisma.UserCreateInput[] = [
        {
          email: 'john@example.com',
          name: 'John Doe',
          password: 'password123',
        },
      ];

      mockUserService.createUser.mockRejectedValue(new Error('Database error'));

      await expect(controller.createUsers(mockUsers)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const mockUser: Prisma.UserUpdateInput = { name: 'Updated Name' };

      mockUserService.updateUsers.mockResolvedValue(undefined);

      const result = await controller.updateUser(1, mockUser);

      expect(userService.updateUsers).toHaveBeenCalledWith(1, mockUser);
      expect(result).toEqual({
        statusCode: 200,
        message: 'User with ID 1 updated successfully.',
      });
    });

    it('should throw HttpException on update failure', async () => {
      const mockUser: Prisma.UserUpdateInput = { name: 'Updated Name' };

      mockUserService.updateUsers.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(controller.updateUser(1, mockUser)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockUserService.deleteUser.mockResolvedValue({ id: 1 });

      const result = await controller.deleteUser(1);

      expect(userService.deleteUser).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        statusCode: 200,
        message: 'User with ID 1 was successfully deleted',
      });
    });

    it('should throw NotFoundException if user is not found for deletion', async () => {
      mockUserService.deleteUser.mockResolvedValue(null);

      await expect(controller.deleteUser(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw HttpException on deletion failure', async () => {
      mockUserService.deleteUser.mockRejectedValue(new Error('Database error'));

      await expect(controller.deleteUser(1)).rejects.toThrow(HttpException);
    });
  });
});
