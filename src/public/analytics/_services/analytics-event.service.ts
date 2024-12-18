import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnalyticsEventDto } from '../_dto/analytics-event.dto';

@Injectable()
export class AnalyticsEventService {
  constructor(private readonly prisma: PrismaService) {}
  async upsertEvent(dto: CreateAnalyticsEventDto) {
    const { application, eventType, eventName, quantity } = dto;

    try {
      const existingEvent = await this.prisma.analyticsEvent.findUnique({
        where: {
          application_eventType_eventName: {
            application,
            eventType,
            eventName,
          },
        },
      });

      if (existingEvent) {
        await this.prisma.analyticsEvent.update({
          where: { id: existingEvent.id },
          data: { quantity: { increment: quantity } },
        });
        return {
          message: 'Event updated successfully.',
        };
      } else {
        await this.prisma.analyticsEvent.create({
          data: { application, eventType, eventName, quantity },
        });
        return {
          message: 'Event created successfully.',
        };
      }
    } catch (error) {
      throw new BadRequestException('Error processing the event.');
    }
  }

  async findAll() {
    return this.prisma.analyticsEvent.findMany();
  }

  async findByApplication(application: string) {
    const events = await this.prisma.analyticsEvent.findMany({
      where: { application },
    });

    if (events.length === 0) {
      throw new NotFoundException(
        `No events found for application "${application}".`,
      );
    }

    return events;
  }

  async deleteEvent(application: string, eventType: string, eventName: string) {
    const existingEvent = await this.prisma.analyticsEvent.findUnique({
      where: {
        application_eventType_eventName: {
          application,
          eventType,
          eventName,
        },
      },
    });

    if (!existingEvent) {
      throw new NotFoundException(
        `Event not found: ${application} - ${eventType} - ${eventName}`,
      );
    }

    await this.prisma.analyticsEvent.delete({
      where: { id: existingEvent.id },
    });

    return { message: 'Event deleted successfully.' };
  }

  async deleteAllEvents() {
    try {
      await this.prisma.analyticsEvent.deleteMany({});
      return { message: 'All events deleted successfully.' };
    } catch (error) {
      throw new BadRequestException('Error deleting all events.');
    }
  }
}