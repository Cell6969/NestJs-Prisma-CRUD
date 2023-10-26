import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(data: CreateTaskDto) {
    const createDate = await this.prisma.tasks.create({
      data: data,
    });
    return {
      statusCode: 200,
      data: createDate,
    };
  }

  async getAllTask() {
    const data = await this.prisma.tasks.findMany();
    return {
      statusCode: 200,
      data: data,
    };
  }

  async getTaskById(id: number) {
    const data = await this.prisma.tasks.findFirst({
      where: {
        id: id,
      },
    });
    return {
      statusCode: 200,
      data: data,
    };
  }

  async updateTaskById(task_id: number, data: UpdateTaskDto) {
    const updateData = await this.prisma.tasks.update({
      where: {
        id: task_id,
      },
      data: data,
    });
    return {
      statusCode: 200,
      data: updateData,
    };
  }

  async deleteTaskById(task_id: number) {
    const deleteData = await this.prisma.tasks.delete({
      where: {
        id: task_id,
      },
    });
    return {
      statusCode: 200,
      data: deleteData,
      message: 'Sukses Menghapus Data',
    };
  }
}
