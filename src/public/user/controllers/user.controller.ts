import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User, Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('healthCheck')
  async healthCheck(): Promise<any> {
    return {
      status: 'ok',
      message: 'Service is up and running',
    };
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | null> {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() data: Prisma.UserCreateInput): Promise<User> {
    return this.userService.createUser(data);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Prisma.UserUpdateInput,
    @Body('adminId') adminId: string,
  ): Promise<User> {
    return this.userService.updateUser(adminId, id, data);
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @Body('adminId') adminId: string,
  ): Promise<User> {
    return this.userService.deleteUser(adminId, id);
  }
}
