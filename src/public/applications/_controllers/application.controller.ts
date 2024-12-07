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
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { RuleAccess } from 'src/public/_decorators/rule-access.decorator';
import { RuleAccessEnum } from 'src/public/_enums/rule-access.enum';
import { AuthGuard } from 'src/public/auth/_guards/auth.guard';
import { RuleAccessGuard } from 'src/public/auth/_guards/rule-access.guard';
import { ApplicationService } from '../_services/application.service';
import { CreateApplicationDto } from '../_dto/create-application.dto';
import { UpdateApplicationDto } from '../_dto/update-application.dto';
import { ParamNumberId } from 'src/public/_decorators/param-number-id.decorator';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getApplications() {
    const applications = await this.applicationService.findAll();

    if (!applications || applications.length === 0) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No applications found',
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Applications retrieved successfully',
      data: applications,
    };
  }

  @RuleAccess(RuleAccessEnum.ADMIN)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createApplication(@Body() data: CreateApplicationDto[]) {
    try {
      if (Array.isArray(data)) {
        await this.applicationService.upsertBulk(data);
        return {
          statusCode: HttpStatus.CREATED,
          message: `${data.length} application(s) processed successfully.`,
        };
      } else {
        const application = await this.applicationService.create(data);
        return {
          statusCode: HttpStatus.CREATED,
          message: 'Application created successfully',
          data: application,
        };
      }
    } catch (error) {
      throw new ConflictException(
        `Failed to process application(s): ${error.message}`,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateApplication(
    @ParamNumberId() id: number,
    @Body() data: UpdateApplicationDto,
  ) {
    const updatedApplication = await this.applicationService.update(id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'Application updated successfully',
      data: updatedApplication,
    };
  }

  @RuleAccess(RuleAccessEnum.ADMIN)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteApplication(@ParamNumberId() id: number) {
    await this.applicationService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Application deleted successfully',
    };
  }
}
