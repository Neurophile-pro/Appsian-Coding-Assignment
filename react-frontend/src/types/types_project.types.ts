export interface Project {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  taskCount: number;
  completedTaskCount: number;
}

export interface CreateProjectDto {
  title: string;
  description?: string;
}
