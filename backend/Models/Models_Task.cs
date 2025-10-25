using System.ComponentModel.DataAnnotations;

namespace backend.Models
// Task ITem Model for the backend application
{
    public class TaskItem
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Description { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; } = false;

        public Guid ProjectId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Project Project { get; set; } = null!;
    }
}
