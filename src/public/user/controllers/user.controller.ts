import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/public/auth/_guards/auth.guard';
import { UserService } from '../services/user.service';
import { User, Prisma } from '@prisma/client';
import { ParamNumberId } from 'src/public/_decorators/param-number-id.decorator';
import { RuleAccess } from 'src/public/_decorators/rule-access.decorator';
import { RuleAccessEnum } from 'src/public/_enums/rule-access.enum';
import { RuleAccessGuard } from 'src/public/auth/_guards/rule-access.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @RuleAccess(RuleAccessEnum.ADMIN)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<{
    statusCode: number;
    message: string;
    data: User[];
  }> {
    const users = await this.userService.getUsers();

    if (!users) {
      throw new NotFoundException(`Users not found`);
    }
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  @RuleAccess(RuleAccessEnum.ADMIN)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(
    @ParamNumberId() id: number,
  ): Promise<{ statusCode: number; message: string; data: User }> {
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `User with ID ${id} retrieved successfully`,
        data: user,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @ParamNumberId() id: number,
    @Body() data: Prisma.UserUpdateInput,
  ): Promise<{ statusCode: number; message: string; data: User }> {
    try {
      const updatedUser = await this.userService.updateUser(id, data);
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found for update`);
      }
      return {
        statusCode: HttpStatus.OK,
        message: `User with ID ${id} updated successfully`,
        data: updatedUser,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to update user with ID ${id}: ${error.message}`,
      );
    }
  }

  @RuleAccess(RuleAccessEnum.ADMIN)
  @UseGuards(AuthGuard, RuleAccessGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @ParamNumberId() id: number,
  ): Promise<{ statusCode: number; message: string }> {
    try {
      const deletedUser = await this.userService.deleteUser(id);

      if (!deletedUser) {
        throw new NotFoundException(
          `User with ID ${id} not found for deletion`,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: `User with ID ${id} was successfully deleted`,
      };
    } catch (error) {
      throw new NotFoundException(
        `Failed to delete user with ID ${id}: ${error.message}`,
      );
    }
  }
}
