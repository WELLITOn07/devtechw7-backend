import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateApplicationDto } from '../_dto/create-application.dto';
import { UpdateApplicationDto } from '../_dto/update-application.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getApplications() {
    const applications = await this.prisma.application.findMany();

    if (!applications || applications.length === 0) {
      throw new NotFoundException('No applications found');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Applications retrieved successfully',
      data: applications,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createApplication(@Body() data: CreateApplicationDto) {
    const existingApplication = await this.prisma.application.findUnique({
      where: { name: data.name },
    });

    if (existingApplication) {
      throw new ConflictException(
        `Application with name ${data.name} already exists`,
      );
    }

    const application = await this.prisma.application.create({
      data,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Application created successfully',
      data: application,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateApplication(
    @Param('id') id: number,
    @Body() data: UpdateApplicationDto,
  ) {
    // Verificar se a aplicação existe
    const application = await this.prisma.application.findUnique({
      where: { id: Number(id) },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    const updatedApplication = await this.prisma.application.update({
      where: { id: Number(id) },
      data,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Application updated successfully',
      data: updatedApplication,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteApplication(@Param('id') id: number) {
    // Verificar se a aplicação existe
    const application = await this.prisma.application.findUnique({
      where: { id: Number(id) },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    await this.prisma.application.delete({
      where: { id: Number(id) },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Application deleted successfully',
    };
  }
}