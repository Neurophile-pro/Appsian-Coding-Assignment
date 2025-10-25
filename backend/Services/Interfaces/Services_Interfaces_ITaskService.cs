using backend.DTOs.Tasks;

namespace backend.Services.Interfaces
{
    public interface ITaskService
    {
        Task<TaskResponseDto> CreateTask(Guid projectId, CreateTaskDto createDto, Guid userId);
        Task<TaskResponseDto> UpdateTask(Guid taskId, UpdateTaskDto updateDto, Guid userId);
        Task DeleteTask(Guid taskId, Guid userId);
        Task<IEnumerable<TaskResponseDto>> GetProjectTasks(Guid projectId, Guid userId);
        Task<IEnumerable<TaskResponseDto>> GetAllUserTasks(Guid userId);
    }
}
