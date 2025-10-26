import api from './services_api';
import { Task, CreateTaskDto, UpdateTaskDto, ScheduleRequestDto, ScheduleResponseDto } from '../types/types_task.types';

export const taskService = {
  async getProjectTasks(projectId: string): Promise<Task[]> {
    const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
    return response.data;
  },
  async createTask(projectId: string, data: CreateTaskDto): Promise<Task> {
    const response = await api.post<Task>(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  async updateTask(taskId: string, data: UpdateTaskDto): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${taskId}`, data);
    return response.data;
  },

  async deleteTask(taskId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}`);
  },

  async scheduleProjectTasks(projectId: string, request: ScheduleRequestDto): Promise<ScheduleResponseDto> {
    const response = await api.post<ScheduleResponseDto>(`/projects/${projectId}/schedule`, request);
    return response.data;
  },
};
