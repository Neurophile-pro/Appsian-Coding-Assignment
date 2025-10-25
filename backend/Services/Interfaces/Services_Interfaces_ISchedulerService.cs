using backend.DTOs.Tasks;

namespace backend.Services.Interfaces
{
    public interface ISchedulerService
    {
        ScheduleResponseDto ScheduleTasks(ScheduleRequestDto request);
    }
}
