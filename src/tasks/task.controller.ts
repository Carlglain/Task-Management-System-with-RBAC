import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from 'src/dto/createtask.dto';
import { UpdateTaskDto } from 'src/dto/updatetask.dto';
import { JwtAuthGuard } from 'src/jwt-auth.gaurd';
import { RolesGuard } from 'src/roles.guard';
import { UserRole } from 'src/enums/user-role.enum';
import { Roles } from 'src/roles.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
    type: CreateTaskDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  createTask(@Request() req, @Body() taskContent: CreateTaskDto) {
    return this.taskService.createTask(taskContent, req.user.userId);
  }

  @ApiOperation({ summary: 'Fetch all tasks' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all tasks.',
    type: [CreateTaskDto],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  allTasks() {
    return this.taskService.allTasks();
  }

  @ApiOperation({ summary: 'Assign a task to a user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully assigned a task to a user.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch()
  assignTask(@Param('taskId') taskId: number, @Param('userId') userId: number) {
    return this.taskService.assignTask(taskId, userId);
  }

  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the task.',
    type: UpdateTaskDto,
  })
  @Patch(':id')
  updateTask(@Param('id') id: number, @Body() taskData: UpdateTaskDto) {
    return this.taskService.updateTask(id, taskData);
  }
}
