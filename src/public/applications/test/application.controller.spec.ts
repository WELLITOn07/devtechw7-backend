import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationController } from '../_controllers/application.controller';
import { ApplicationService } from '../_services/application.service';
import { CreateApplicationDto } from '../_dto/create-application.dto';
import { UpdateApplicationDto } from '../_dto/update-application.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AuthGuard } from 'src/public/auth/_guards/auth.guard';
import { RuleAccessGuard } from 'src/public/auth/_guards/rule-access.guard';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ApplicationController', () => {
  let controller: ApplicationController;
  let applicationService: ApplicationService;

  const mockPrismaService = {
    application: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockApplicationService = {
    findAll: jest.fn(),
    create: jest.fn(),
    upsertBulk: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true), // Always allow the route for tests
  };

  const mockRuleAccessGuard = {
    canActivate: jest.fn(() => true), // Always allow the route for tests
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationController],
      providers: [
        { provide: ApplicationService, useValue: mockApplicationService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RuleAccessGuard)
      .useValue(mockRuleAccessGuard)
      .compile();

    controller = module.get<ApplicationController>(ApplicationController);
    applicationService = module.get<ApplicationService>(ApplicationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getApplications', () => {
    it('should return a list of applications', async () => {
      const mockApplications = [
        {
          id: 1,
          name: 'App1',
          description: 'Test App1',
          controllers: [],
          allowedRoles: [],
        },
        {
          id: 2,
          name: 'App2',
          description: 'Test App2',
          controllers: [],
          allowedRoles: [],
        },
      ];
      mockApplicationService.findAll.mockResolvedValue(mockApplications);

      const result = await controller.getApplications();
      expect(applicationService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        statusCode: 200,
        message: 'Applications retrieved successfully',
        data: mockApplications,
      });
    });

    it('should return a message if no applications found', async () => {
      mockApplicationService.findAll.mockResolvedValue([]);
      const result = await controller.getApplications();
      expect(result).toEqual({
        statusCode: 404,
        message: 'No applications found',
      });
    });
  });

  describe('createApplication', () => {
    it('should create a single application and return it', async () => {
      const createDto: CreateApplicationDto[] = [
        {
          name: 'New App',
          description: 'Test Application',
          controllers: ['controller1'],
          allowedRoles: ['role1'],
        },
      ];

      const mockApplication = { id: 1, ...createDto[0] };
      mockApplicationService.create.mockResolvedValue(mockApplication);

      const result = await controller.createApplication(createDto);
      expect(applicationService.upsertBulk).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({
        statusCode: 201,
        message: '1 application(s) processed successfully.',
      });
    });

    it('should throw ConflictException on creation failure', async () => {
      const createDto: CreateApplicationDto[] = [
        {
          name: 'New App',
          description: 'Test Application',
          controllers: ['controller1'],
          allowedRoles: ['role1'],
        },
      ];

      mockApplicationService.create.mockRejectedValue(
        new ConflictException('Application already exists'),
      );

      await expect(controller.createApplication(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateApplication', () => {
    it('should update an application successfully', async () => {
      const updateDto: UpdateApplicationDto = {
        name: 'Updated App',
        description: 'Updated Description',
        controllers: ['updatedController'],
        allowedRoles: ['role1'],
      };

      const updatedApplication = {
        id: 1,
        name: 'App1',
        description: 'Updated Description',
        controllers: ['updatedController'],
        allowedRoles: ['role1'],
      };

      mockApplicationService.update.mockResolvedValue(updatedApplication);

      const result = await controller.updateApplication(1, updateDto);
      expect(applicationService.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Application updated successfully',
        data: updatedApplication,
      });
    });

    it('should throw NotFoundException if application is not found', async () => {
      const updateDto: UpdateApplicationDto = {
        name: 'Updated App',
        description: 'Updated Description',
        controllers: ['updatedController'],
        allowedRoles: ['role1'],
      };

      mockApplicationService.update.mockRejectedValue(
        new NotFoundException('Application not found'),
      );

      await expect(
        controller.updateApplication(999, updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteApplication', () => {
    it('should delete an application successfully', async () => {
      mockApplicationService.delete.mockResolvedValue(undefined);

      const result = await controller.deleteApplication(1);
      expect(applicationService.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Application deleted successfully',
      });
    });

    it('should throw NotFoundException if application is not found', async () => {
      mockApplicationService.delete.mockRejectedValue(
        new NotFoundException('Application not found'),
      );

      await expect(controller.deleteApplication(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

