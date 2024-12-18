import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpException,
  HttpStatus,
  NotFoundException,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateAdvertisementDto } from '../_dto/create-advertisement.dto';
import { AdvertisementService } from '../_services/advertisement.service';
import { ParamNumberId } from 'src/public/_decorators/param-number-id.decorator';
import { AuthGuard } from 'src/public/auth/_guards/auth.guard';
import { RuleAccessGuard } from 'src/public/auth/_guards/rule-access.guard';
import { RuleAccess } from 'src/public/_decorators/rule-access.decorator';
import { RuleAccessEnum } from 'src/public/_enums/rule-access.enum';
import { UpdateAdvertisementDto } from '../_dto/update-advertisement.dto';

@Controller('advertisements')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}
  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Post()
  async create(@Body() createAdvertisementDto: CreateAdvertisementDto) {
    try {
      const ad = await this.advertisementService.create(createAdvertisementDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Advertisement created successfully',
        data: ad,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create advertisement: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Get()
  async findAll() {
    try {
      const ads = await this.advertisementService.findAll();
      return {
        statusCode: HttpStatus.OK,
        message: 'Advertisements retrieved successfully',
        data: ads,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve advertisements: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Get(':id')
  async findOne(@ParamNumberId() id: number) {
    try {
      const ad = await this.advertisementService.findOne(id);
      if (!ad) {
        throw new NotFoundException(`Advertisement with ID ${id} not found`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `Advertisement with ID ${id} retrieved successfully`,
        data: ad,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve advertisement: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Put(':id') 
  async update(
    @ParamNumberId() id: number,
    @Body() updateAdvertisementDto: UpdateAdvertisementDto,
  ) {
    try {
      const updatedAd = await this.advertisementService.update(
        id,
        updateAdvertisementDto,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Advertisement updated successfully',
        data: updatedAd,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to update advertisement: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Delete(':id')
  async delete(@ParamNumberId() id: number) {
    try {
      await this.advertisementService.delete(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Advertisement deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        `Failed to delete advertisement: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

