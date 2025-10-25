using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.Tasks;
using backend.Models;
using backend.Services.Interfaces;

namespace backend.Services
{
    public class TaskService : ITaskService
    {
        private readonly ApplicationDbContext _context;

        public TaskService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TaskResponseDto> CreateTask(Guid projectId, CreateTaskDto createDto, Guid userId)
        {
            // Verify project exists and belongs to user
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
            {
                throw new Exception("Project not found");
            }

            var task = new TaskItem
            {
                Id = Guid.NewGuid(),
                Description = createDto.Title,
                DueDate = createDto.DueDate,
                IsCompleted = createDto.IsCompleted,
                ProjectId = projectId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return MapToDto(task);
        }

        public async Task<TaskResponseDto> UpdateTask(Guid taskId, UpdateTaskDto updateDto, Guid userId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

            if (task == null)
            {
                throw new Exception("Task not found");
            }

            // Update only provided fields
            if (!string.IsNullOrWhiteSpace(updateDto.Title))
            {
                task.Description = updateDto.Title;
            }

            if (updateDto.DueDate.HasValue)
            {
                task.DueDate = updateDto.DueDate;
            }

            if (updateDto.IsCompleted.HasValue)
            {
                task.IsCompleted = updateDto.IsCompleted.Value;
            }

            task.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToDto(task);
        }

        public async Task DeleteTask(Guid taskId, Guid userId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

            if (task == null)
            {
                throw new Exception("Task not found");
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<TaskResponseDto>> GetProjectTasks(Guid projectId, Guid userId)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
            {
                throw new Exception("Project not found");
            }

            var tasks = await _context.Tasks
                .Where(t => t.ProjectId == projectId)
                .OrderBy(t => t.CreatedAt)
                .ToListAsync();

            return tasks.Select(MapToDto);
        }

        public async Task<IEnumerable<TaskResponseDto>> GetAllUserTasks(Guid userId)
        {
            var tasks = await _context.Tasks
                .Include(t => t.Project)
                .Where(t => t.Project.UserId == userId)
                .OrderBy(t => t.CreatedAt)
                .ToListAsync();

            return tasks.Select(MapToDto);
        }

        private static TaskResponseDto MapToDto(TaskItem task)
        {
            return new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Description,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                ProjectId = task.ProjectId,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt
            };
        }
    }
}
