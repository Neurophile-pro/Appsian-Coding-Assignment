using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public ICollection<Project> Projects { get; set; } = new List<Project>();
    }
}
