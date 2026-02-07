import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from 'src/dto/createtask.dto';
import { UpdateTaskDto } from 'src/dto/updatetask.dto';
import { UserRole } from 'src/enums/user-role.enum';
import { Task } from 'src/typeorm/entities/Task';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,

    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async createTask(content: CreateTaskDto, id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newTask = this.taskRepository.create({
      ...content,
      assignedTo: user,
    });
    return this.taskRepository.save(newTask);
  }

  allTasks() {
    return this.taskRepository.find();
  }
  async updateTask(id: number, taskData: UpdateTaskDto) {
    const existingTask = await this.taskRepository.findOne({ where: { id } });
    if (!existingTask) {
      throw new NotFoundException('Task was not found');
    }
    Object.assign(existingTask, taskData);
    return this.taskRepository.save(existingTask);
  }
  async assignTask(taskId: number, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    task.assignedTo = user;
  }

  async deleteTask(id: number) {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Task Not found');
    }
    return { message: 'Task deleted successfully' };
  }
}
