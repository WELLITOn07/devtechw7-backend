import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User, Prisma } from '@prisma/client';
import { ParamNumberId } from 'src/public/decorators/param-number-id.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<{
    statusCode: number;
    message: string;
    data: User[];
  }> {
    const users = await this.userService.getUsers();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data: users,
    };
  }

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
