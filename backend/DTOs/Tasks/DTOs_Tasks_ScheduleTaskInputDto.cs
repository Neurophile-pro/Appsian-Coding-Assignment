namespace backend.DTOs.Tasks
{
    public class ScheduleTaskInputDto
    {
        public string Title { get; set; } = string.Empty;
        public int EstimatedHours { get; set; }
        public DateTime DueDate { get; set; }
        public List<string> Dependencies { get; set; } = new();
    }
}
