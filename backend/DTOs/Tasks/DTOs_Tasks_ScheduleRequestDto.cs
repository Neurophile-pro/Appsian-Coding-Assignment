namespace backend.DTOs.Tasks
{
    public class ScheduleRequestDto
    {
        public List<ScheduleTaskInputDto> Tasks { get; set; } = new();
    }
}
