import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User, Prisma } from '@prisma/client';
import { ParamNumberId } from 'src/public/decorators/param-number-id.decorator';
import { ConflictException, NotFoundException } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@ParamNumberId() id: number): Promise<User> {
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() data: Prisma.UserCreateInput): Promise<User> {
    try {
      const user = await this.userService.createUser(data);
      if (!user) {
        throw new ConflictException(
          `A user with the email ${data.email} already exists`,
        );
      }
      return user;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @ParamNumberId() id: number,
    @Body() data: Prisma.UserUpdateInput,
  ): Promise<User> {
    try {
      const updatedUser = await this.userService.updateUser(id, data);
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found for update`);
      }
      return updatedUser;
    } catch (error) {
      throw new NotFoundException(
        `Failed to update user with ID ${id}: ${error.message}`,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK) // Mudança para permitir retornar uma mensagem de sucesso
  async deleteUser(@ParamNumberId() id: number): Promise<{ message: string }> {
    try {
      const deletedUser = await this.userService.deleteUser(id);

      if (!deletedUser) {
        throw new NotFoundException(
          `User with ID ${id} not found for deletion`,
        );
      }

      return { message: `User with ID ${id} was successfully deleted` };
    } catch (error) {
      throw new NotFoundException(
        `Failed to delete user with ID ${id}: ${error.message}`,
      );
    }
  }
}
