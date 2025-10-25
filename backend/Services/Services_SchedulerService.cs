using backend.DTOs.Tasks;
using backend.Services.Interfaces;

namespace backend.Services
{
    public class SchedulerService : ISchedulerService
    {
        public ScheduleResponseDto ScheduleTasks(ScheduleRequestDto request)
        {
            // Validate input
            if (request.Tasks == null || !request.Tasks.Any())
            {
                return new ScheduleResponseDto { RecommendedOrder = new List<string>() };
            }

            // Build a dictionary for quick task lookup
            var taskDict = request.Tasks.ToDictionary(t => t.Title, t => t);

            // Validate all dependencies exist
            foreach (var task in request.Tasks)
            {
                foreach (var dependency in task.Dependencies)
                {
                    if (!taskDict.ContainsKey(dependency))
                    {
                        throw new ArgumentException($"Task '{task.Title}' has a dependency on non-existent task '{dependency}'");
                    }
                }
            }

            // Topological sort using Kahn's algorithm
            var inDegree = new Dictionary<string, int>();
            var adjacencyList = new Dictionary<string, List<string>>();

            // Initialize structures
            foreach (var task in request.Tasks)
            {
                inDegree[task.Title] = 0;
                adjacencyList[task.Title] = new List<string>();
            }

            // Build graph - if B depends on A, then A -> B (A must come before B)
            foreach (var task in request.Tasks)
            {
                foreach (var dependency in task.Dependencies)
                {
                    adjacencyList[dependency].Add(task.Title);
                    inDegree[task.Title]++;
                }
            }

            // Find all tasks with no dependencies (in-degree = 0)
            var queue = new Queue<string>();
            foreach (var task in request.Tasks)
            {
                if (inDegree[task.Title] == 0)
                {
                    queue.Enqueue(task.Title);
                }
            }

            var result = new List<string>();

            // Process tasks in topological order
            while (queue.Count > 0)
            {
                // If multiple tasks are ready, prioritize by due date and estimated hours
                var readyTasks = new List<string>();
                var queueCount = queue.Count;

                for (int i = 0; i < queueCount; i++)
                {
                    readyTasks.Add(queue.Dequeue());
                }

                // Sort ready tasks by due date (earliest first), then by estimated hours (shortest first)
                readyTasks = readyTasks
                    .OrderBy(t => taskDict[t].DueDate)
                    .ThenBy(t => taskDict[t].EstimatedHours)
                    .ToList();

                foreach (var current in readyTasks)
                {
                    result.Add(current);

                    // Reduce in-degree for dependent tasks
                    foreach (var neighbor in adjacencyList[current])
                    {
                        inDegree[neighbor]--;
                        if (inDegree[neighbor] == 0)
                        {
                            queue.Enqueue(neighbor);
                        }
                    }
                }
            }

            // Check for cycles
            if (result.Count != request.Tasks.Count)
            {
                throw new InvalidOperationException("Circular dependency detected in tasks. Cannot create a valid schedule.");
            }

            return new ScheduleResponseDto { RecommendedOrder = result };
        }
    }
}
