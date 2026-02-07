import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  password?: string;
}
