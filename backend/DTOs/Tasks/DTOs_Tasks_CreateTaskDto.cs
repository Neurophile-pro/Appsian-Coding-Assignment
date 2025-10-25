using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Tasks
{
    public class CreateTaskDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; } = false;
    }
}
