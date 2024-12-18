import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
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

@Controller('advertisements')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}
  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Put(':id')
  async update(
    @ParamNumberId('id') id: number,
    @Body() updateAdvertisementDto: CreateAdvertisementDto,
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
      throw new NotFoundException(
        `Failed to update advertisement: ${error.message}`,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN, RuleAccessEnum.MODERATOR)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Delete(':id')
  async delete(@ParamNumberId('id') id: number) {
    try {
      await this.advertisementService.delete(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Advertisement deleted successfully',
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to delete advertisement: ${error.message}`,
      );
    }
  }
}
