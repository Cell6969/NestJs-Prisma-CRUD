/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from 'class-validator';

/* eslint-disable prettier/prettier */
export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  task_name: string;

  @IsString()
  @IsOptional()
  task_description: string;
}
