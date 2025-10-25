using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Tasks;
using backend.Services.Interfaces;

namespace backend.Controllers
{
    [ApiController]
    [Route("api")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly ISchedulerService _schedulerService;

        public TasksController(ITaskService taskService, ISchedulerService schedulerService)
        {
            _taskService = taskService;
            _schedulerService = schedulerService;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim!);
        }

        [HttpPost("projects/{projectId}/tasks")]
        public async Task<ActionResult<TaskResponseDto>> CreateTask(Guid projectId, [FromBody] CreateTaskDto createDto)
        {
            try
            {
                var userId = GetUserId();
                var task = await _taskService.CreateTask(projectId, createDto, userId);
                return CreatedAtAction(nameof(CreateTask), new { projectId, id = task.Id }, task);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("tasks/{taskId}")]
        public async Task<ActionResult<TaskResponseDto>> UpdateTask(Guid taskId, [FromBody] UpdateTaskDto updateDto)
        {
            try
            {
                var userId = GetUserId();
                var task = await _taskService.UpdateTask(taskId, updateDto, userId);
                return Ok(task);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("tasks/{taskId}")]
        public async Task<ActionResult> DeleteTask(Guid taskId)
        {
            try
            {
                var userId = GetUserId();
                await _taskService.DeleteTask(taskId, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("tasks")]
        public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetAllTasks()
        {
            try
            {
                var userId = GetUserId();
                var tasks = await _taskService.GetAllUserTasks(userId);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("tasks")]
        public async Task<ActionResult<TaskResponseDto>> CreateTaskWithoutProject([FromBody] CreateTaskDto createDto)
        {
            try
            {
                var userId = GetUserId();
                // This would require a default project or a way to create tasks without projects
                // For now, return a BadRequest suggesting to use the project-specific endpoint
                return BadRequest(new { message = "Please use POST /api/projects/{projectId}/tasks to create tasks within a project context." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("projects/{projectId}/tasks")]
        public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetProjectTasks(Guid projectId)
        {
            try
            {
                var userId = GetUserId();
                var tasks = await _taskService.GetProjectTasks(projectId, userId);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost("projects/{projectId}/schedule")]
        public ActionResult<ScheduleResponseDto> ScheduleProject(Guid projectId, [FromBody] ScheduleRequestDto request)
        {
            try
            {
                var userId = GetUserId();
                // Note: You could add authorization check here to verify user owns the project
                var schedule = _schedulerService.ScheduleTasks(request);
                return Ok(schedule);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
