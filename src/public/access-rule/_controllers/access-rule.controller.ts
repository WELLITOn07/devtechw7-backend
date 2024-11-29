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
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RuleAccess } from 'src/public/_decorators/rule-access.decorator';
import { AuthGuard } from 'src/public/auth/_guards/auth.guard';
import { RuleAccessGuard } from 'src/public/auth/_guards/rule-access.guard';
import { RuleAccessEnum } from 'src/public/_enums/rule-access.enum';
import { CreateAccessRuleDto } from '../_dto/create-access-rule.dto';
import { UpdateAccessRuleDto } from '../_dto/update-access-rule.dto';
import { ParamNumberId } from 'src/public/_decorators/param-number-id.decorator';

@Controller('access-rules')
export class AccessRuleController {
  constructor(private readonly prisma: PrismaService) {}

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAccessRules() {
    const accessRules = await this.prisma.accessRule.findMany();

    if (!accessRules || accessRules.length === 0) {
      throw new NotFoundException('No access rules found');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Access rules retrieved successfully',
      data: accessRules,
    };
  }

  @RuleAccess(RuleAccessEnum.ADMIN)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAccessRule(@Body() data: CreateAccessRuleDto) {
    const existingRule = await this.prisma.accessRule.findUnique({
      where: { urlOrigin: data.urlOrigin },
    });

    if (existingRule) {
      throw new ConflictException(
        `Access rule for URL ${data.urlOrigin} already exists`,
      );
    }

    const accessRule = await this.prisma.accessRule.create({
      data,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Access rule created successfully',
      data: accessRule,
    };
  }

  @RuleAccess(RuleAccessEnum.ADMIN)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateAccessRule(
    @ParamNumberId() id: number,
    @Body() data: UpdateAccessRuleDto,
  ) {
    const accessRule = await this.prisma.accessRule.findUnique({
      where: { id: Number(id) },
    });

    if (!accessRule) {
      throw new NotFoundException(`Access rule with ID ${id} not found`);
    }

    const updatedAccessRule = await this.prisma.accessRule.update({
      where: { id: Number(id) },
      data,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Access rule updated successfully',
      data: updatedAccessRule,
    };
  }

  @RuleAccess(RuleAccessEnum.ADMIN)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteAccessRule(@ParamNumberId() id: number) {
    const accessRule = await this.prisma.accessRule.findUnique({
      where: { id: Number(id) },
    });

    if (!accessRule) {
      throw new NotFoundException(`Access rule with ID ${id} not found`);
    }

    await this.prisma.accessRule.delete({
      where: { id: Number(id) },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Access rule deleted successfully',
    };
  }
}