import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TaskStatus } from 'src/enums/task-status.enum';
export class CreateTaskDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  status?: TaskStatus;

  @IsString()
  @ApiProperty()
  description: string;
}
