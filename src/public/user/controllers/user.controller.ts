import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User, Prisma } from '@prisma/client';
import { ParamNumberId } from 'src/public/decorators/param-number-id.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUserById(
    @ParamNumberId() id: number,
  ): Promise<User | null> {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() data: Prisma.UserCreateInput): Promise<User> {
    return this.userService.createUser(data);
  }

  @Put(':id')
  async updateUser(
    @ParamNumberId() id: number,
    @Body() data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUser(@ParamNumberId() id: number): Promise<User> {
    return this.userService.deleteUser(id);
  }
}
