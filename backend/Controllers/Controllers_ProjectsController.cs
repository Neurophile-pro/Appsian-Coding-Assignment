using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Projects;
using backend.Services.Interfaces;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/projects")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim!);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectResponseDto>>> GetProjects()
        {
            try
            {
                var userId = GetUserId();
                var projects = await _projectService.GetUserProjects(userId);
                return Ok(projects);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectResponseDto>> GetProject(Guid id)
        {
            try
            {
                var userId = GetUserId();
                var project = await _projectService.GetProjectById(id, userId);
                return Ok(project);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<ProjectResponseDto>> CreateProject([FromBody] CreateProjectDto createDto)
        {
            try
            {
                var userId = GetUserId();
                var project = await _projectService.CreateProject(createDto, userId);
                return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProject(Guid id)
        {
            try
            {
                var userId = GetUserId();
                await _projectService.DeleteProject(id, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
