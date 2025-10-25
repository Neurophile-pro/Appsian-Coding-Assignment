using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs.Projects;
using backend.Models;
using backend.Services.Interfaces;

namespace backend.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ApplicationDbContext _context;

        public ProjectService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjectResponseDto>> GetUserProjects(Guid userId)
        {
            var projects = await _context.Projects
                .Include(p => p.Tasks)
                .Where(p => p.UserId == userId)
                .Select(p => new ProjectResponseDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt,
                    TaskCount = p.Tasks.Count,
                    CompletedTaskCount = p.Tasks.Count(t => t.IsCompleted)
                })
                .ToListAsync();

            return projects;
        }

        public async Task<ProjectResponseDto> GetProjectById(Guid projectId, Guid userId)
        {
            var project = await _context.Projects
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
            {
                throw new Exception("Project not found");
            }

            return new ProjectResponseDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                CreatedAt = project.CreatedAt,
                TaskCount = project.Tasks.Count,
                CompletedTaskCount = project.Tasks.Count(t => t.IsCompleted)
            };
        }

        public async Task<ProjectResponseDto> CreateProject(CreateProjectDto createDto, Guid userId)
        {
            var project = new Project
            {
                Id = Guid.NewGuid(),
                Title = createDto.Title,
                Description = createDto.Description,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return new ProjectResponseDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                CreatedAt = project.CreatedAt,
                TaskCount = 0,
                CompletedTaskCount = 0
            };
        }

        public async Task DeleteProject(Guid projectId, Guid userId)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
            {
                throw new Exception("Project not found");
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
        }
    }
}
