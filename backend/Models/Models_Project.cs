using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Project
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(10, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;

        [StringLength(90)]
        public string? Description { get; set; }

        public Guid UserId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public User User { get; set; } = null!;
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}
