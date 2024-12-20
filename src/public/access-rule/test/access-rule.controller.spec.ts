import { Test, TestingModule } from '@nestjs/testing';
import { AccessRuleController } from '../_controllers/access-rule.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from '../../auth/_guards/auth.guard';
import { RuleAccessGuard } from '../../auth/_guards/rule-access.guard';
import { NotFoundException } from '@nestjs/common';
import { CreateAccessRuleDto } from '../_dto/create-access-rule.dto';
import { UpdateAccessRuleDto } from '../_dto/update-access-rule.dto';

describe('AccessRuleController', () => {
  let controller: AccessRuleController;
  let prismaService: PrismaService;

  const mockPrismaService = {
    accessRule: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRuleAccessGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccessRuleController],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RuleAccessGuard)
      .useValue(mockRuleAccessGuard)
      .compile();

    controller = module.get<AccessRuleController>(AccessRuleController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAccessRules', () => {
    it('should return all access rules', async () => {
      const mockRules = [
        { id: 1, urlOrigin: 'http://example.com', allowedRoles: ['ADMIN'] },
      ];
      mockPrismaService.accessRule.findMany.mockResolvedValue(mockRules);

      const result = await controller.getAccessRules();

      expect(prismaService.accessRule.findMany).toHaveBeenCalled();
      expect(result).toEqual({
        statusCode: 200,
        message: 'Access rules retrieved successfully',
        data: mockRules,
      });
    });

    it('should throw NotFoundException if no access rules found', async () => {
      mockPrismaService.accessRule.findMany.mockResolvedValue([]);

      await expect(controller.getAccessRules()).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createOrUpdateAccessRules', () => {
    it('should create or update access rules', async () => {
      const mockData: CreateAccessRuleDto[] = [
        { urlOrigin: 'http://example.com', allowedRoles: ['ADMIN'] },
      ];

      mockPrismaService.accessRule.upsert.mockResolvedValue(undefined);

      const result = await controller.createOrUpdateAccessRules(mockData);

      expect(prismaService.accessRule.upsert).toHaveBeenCalledWith({
        where: { urlOrigin: 'http://example.com' },
        update: { allowedRoles: ['ADMIN'] },
        create: { urlOrigin: 'http://example.com', allowedRoles: ['ADMIN'] },
      });
      expect(result).toEqual({
        statusCode: 201,
        message: '1 access rule(s) processed successfully.',
      });
    });

    it('should throw an error for invalid input', async () => {
      await expect(
        controller.createOrUpdateAccessRules([]),
      ).rejects.toThrowError(
        'Invalid input: Data should be a non-empty array.',
      );
    });
  });

  describe('updateAccessRule', () => {
    it('should update an access rule successfully', async () => {
      const id = 1;
      const updateDto: UpdateAccessRuleDto = {
        urlOrigin: 'http://example.com',
        allowedRoles: ['MODERATOR'],
      };
      const mockRule = {
        id: 1,
        urlOrigin: 'http://example.com',
        allowedRoles: ['ADMIN'],
      };
      const updatedRule = {
        ...mockRule,
        allowedRoles: ['MODERATOR'],
      };

      mockPrismaService.accessRule.findUnique.mockResolvedValue(mockRule);
      mockPrismaService.accessRule.update.mockResolvedValue(updatedRule);

      const result = await controller.updateAccessRule(id, updateDto);

      expect(prismaService.accessRule.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(prismaService.accessRule.update).toHaveBeenCalledWith({
        where: { id },
        data: updateDto,
      });
      expect(result).toEqual({
        statusCode: 200,
        message: 'Access rule updated successfully',
        data: updatedRule,
      });
    });

    it('should throw NotFoundException if rule not found', async () => {
      const id = 999;
      const updateDto: UpdateAccessRuleDto = {
        urlOrigin: 'http://example.com',
        allowedRoles: ['MODERATOR'],
      };

      mockPrismaService.accessRule.findUnique.mockResolvedValue(null);

      await expect(controller.updateAccessRule(id, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteAccessRule', () => {
    it('should delete an access rule successfully', async () => {
      const id = 1;
      const mockRule = { id, urlOrigin: 'http://example.com' };

      mockPrismaService.accessRule.findUnique.mockResolvedValue(mockRule);
      mockPrismaService.accessRule.delete.mockResolvedValue(undefined);

      const result = await controller.deleteAccessRule(id);

      expect(prismaService.accessRule.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(prismaService.accessRule.delete).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual({
        statusCode: 200,
        message: 'Access rule deleted successfully',
      });
    });

    it('should throw NotFoundException if rule not found', async () => {
      const id = 999;

      mockPrismaService.accessRule.findUnique.mockResolvedValue(null);

      await expect(controller.deleteAccessRule(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
