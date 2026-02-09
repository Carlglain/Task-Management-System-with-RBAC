import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dto/createuser.dto';
import { UpdateUserDto } from 'src/dto/updateuser.dto';
import { JwtAuthGuard } from 'src/jwt-auth.gaurd';
import { UserRole } from 'src/enums/user-role.enum';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from 'src/roles.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: CreateUserDto,
  })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  @Post()
  createUser(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully.',
  })
  @Post('login')
  login(@Body() authPayLoad: { email: string; password: string }) {
    return this.userService.validateUser(authPayLoad);
  }

  @ApiOperation({ summary: 'Fetch all users' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all users.',
    type: CreateUserDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  allUsers() {
    return this.userService.fetchUsers();
  }

  @ApiOperation({ summary: 'Fetch a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the user.',
    type: CreateUserDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() userData: UpdateUserDto) {
    return this.userService.upDateUser(+id, userData);
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted the user.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  removeUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
