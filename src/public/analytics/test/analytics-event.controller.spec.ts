import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsEventController } from '../_controllers/analytics-event.controller';
import { AnalyticsEventService } from '../_services/analytics-event.service';
import { AuthGuard } from '../../auth/_guards/auth.guard';
import { RuleAccessGuard } from '../../auth/_guards/rule-access.guard';
import { CreateAnalyticsEventDto } from '../_dto/analytics-event.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AnalyticsEventController', () => {
  let controller: AnalyticsEventController;
  let service: AnalyticsEventService;

  const mockAnalyticsEventService = {
    upsertEvent: jest.fn(),
    findAll: jest.fn(),
    findByApplication: jest.fn(),
    deleteEvent: jest.fn(),
    deleteAllEvents: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockRuleAccessGuard = {
    canActivate: jest.fn(() => true), 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsEventController],
      providers: [
        {
          provide: AnalyticsEventService,
          useValue: mockAnalyticsEventService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RuleAccessGuard)
      .useValue(mockRuleAccessGuard)
      .compile();

    controller = module.get<AnalyticsEventController>(AnalyticsEventController);
    service = module.get<AnalyticsEventService>(AnalyticsEventService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('upsertEvent', () => {
    it('should create or update an event', async () => {
      const dto: CreateAnalyticsEventDto = {
        application: 'TestApp',
        eventType: 'CLICK',
        eventName: 'TestEvent',
        quantity: 1,
      };

      const mockResponse = { message: 'Event created successfully.' };
      mockAnalyticsEventService.upsertEvent.mockResolvedValue(mockResponse);

      const result = await controller.upsertEvent(dto);

      expect(service.upsertEvent).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResponse);
    });

    it('should throw BadRequestException on error', async () => {
      const dto: CreateAnalyticsEventDto = {
        application: 'TestApp',
        eventType: 'CLICK',
        eventName: 'TestEvent',
        quantity: 1,
      };

      mockAnalyticsEventService.upsertEvent.mockRejectedValue(
        new BadRequestException('Error processing the event.'),
      );

      await expect(controller.upsertEvent(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all events', async () => {
      const mockEvents = [
        { application: 'TestApp', eventType: 'CLICK', eventName: 'TestEvent' },
      ];
      mockAnalyticsEventService.findAll.mockResolvedValue(mockEvents);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockEvents);
    });
  });

  describe('findByApplication', () => {
    it('should return events for a specific application', async () => {
      const application = 'TestApp';
      const mockEvents = [
        { application, eventType: 'CLICK', eventName: 'TestEvent' },
      ];
      mockAnalyticsEventService.findByApplication.mockResolvedValue(mockEvents);

      const result = await controller.findByApplication(application);

      expect(service.findByApplication).toHaveBeenCalledWith(application);
      expect(result).toEqual(mockEvents);
    });

    it('should throw NotFoundException if no events found', async () => {
      const application = 'NonExistentApp';
      mockAnalyticsEventService.findByApplication.mockRejectedValue(
        new NotFoundException(
          `No events found for application "${application}".`,
        ),
      );

      await expect(controller.findByApplication(application)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteEvent', () => {
    it('should delete a specific event', async () => {
      const application = 'TestApp';
      const eventType = 'CLICK';
      const eventName = 'TestEvent';

      const mockResponse = { message: 'Event deleted successfully.' };
      mockAnalyticsEventService.deleteEvent.mockResolvedValue(mockResponse);

      const result = await controller.deleteEvent(
        application,
        eventType,
        eventName,
      );

      expect(service.deleteEvent).toHaveBeenCalledWith(
        application,
        eventType,
        eventName,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw NotFoundException if event not found', async () => {
      const application = 'NonExistentApp';
      const eventType = 'CLICK';
      const eventName = 'TestEvent';

      mockAnalyticsEventService.deleteEvent.mockRejectedValue(
        new NotFoundException(
          `Event not found: ${application} - ${eventType} - ${eventName}`,
        ),
      );

      await expect(
        controller.deleteEvent(application, eventType, eventName),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAllEvents', () => {
    it('should delete all events', async () => {
      const mockResponse = { message: 'All events deleted successfully.' };
      mockAnalyticsEventService.deleteAllEvents.mockResolvedValue(mockResponse);

      const result = await controller.deleteAllEvents();

      expect(service.deleteAllEvents).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should throw BadRequestException on error', async () => {
      mockAnalyticsEventService.deleteAllEvents.mockRejectedValue(
        new BadRequestException('Error deleting all events.'),
      );

      await expect(controller.deleteAllEvents()).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
