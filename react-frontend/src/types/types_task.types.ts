export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  projectId: string;
  estimatedHours?: number;
  dependencies?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  dueDate?: string;
  isCompleted?: boolean;
  estimatedHours?: number;
  dependencies?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  dueDate?: string;
  isCompleted?: boolean;
  estimatedHours?: number;
  dependencies?: string[];
}

// Scheduler types
export interface ScheduleTaskInputDto {
  title: string;
  estimatedHours: number;
  dueDate: string;
  dependencies: string[];
}

export interface ScheduleRequestDto {
  tasks: ScheduleTaskInputDto[];
}

export interface ScheduleResponseDto {
  recommendedOrder: string[];
}
