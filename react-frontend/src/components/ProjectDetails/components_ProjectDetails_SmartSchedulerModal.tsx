import React, { useState } from 'react';
import { Task, ScheduleTaskInputDto } from '../../types/types_task.types';
import { taskService } from '../../services/services_taskService';

interface Props {
    projectId: string;
    tasks: Task[];
    onClose: () => void;
}

const SmartSchedulerModal: React.FC<Props> = ({ projectId, tasks, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [recommendedOrder, setRecommendedOrder] = useState<string[]>([]);
    const [hasScheduled, setHasScheduled] = useState(false);

    const handleSchedule = async () => {
        setError('');
        setLoading(true);
        console.log('Tasks:', tasks);

        try {
            // Filter tasks that have the required fields for scheduling
            const schedulableTasks = tasks.filter(
                (task) =>
                    !task.isCompleted &&
                    task.dueDate
            );

            console.log('Schedulable tasks:', schedulableTasks);

            if (schedulableTasks.length === 0) {
                setError('No tasks available for scheduling. Tasks need estimated hours and due dates.');
                setLoading(false);
                return;
            }

            // Prepare the request
            const scheduleRequest: ScheduleTaskInputDto[] = schedulableTasks.map((task) => ({
                title: task.title,
                estimatedHours: task.estimatedHours!,
                dueDate: task.dueDate!,
                dependencies: task.dependencies || [],
            }));

            console.log('Schedule request:', scheduleRequest);

            const response = await taskService.scheduleProjectTasks(projectId, {
                tasks: scheduleRequest,
            });

            console.log('Schedule response:', response);

            setRecommendedOrder(response.recommendedOrder);
            setHasScheduled(true);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to schedule tasks';
            setError(errorMessage);
            console.error('Scheduling error:', err);
            console.error('Error response:', err.response);
        } finally {
            setLoading(false);
        }
    };

    const getTaskByTitle = (title: string) => {
        return tasks.find((t) => t.title === title);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content scheduler-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>🤖 Smart Task Scheduler</h2>
                    <button onClick={onClose} className="btn-close">
                        ×
                    </button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    {!hasScheduled ? (
                        <>
                            <p style={{ marginBottom: '1rem', color: '#666' }}>
                                The smart scheduler analyzes your tasks based on:
                            </p>
                            <ul style={{ marginBottom: '1.5rem', color: '#666', paddingLeft: '1.5rem' }}>
                                <li>Task dependencies (tasks that must be completed first)</li>
                                <li>Due dates (prioritizing urgent tasks)</li>
                                <li>Estimated effort (balancing workload)</li>
                            </ul>

                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Schedulable Tasks:</strong>{' '}
                                {tasks.filter((t) => !t.isCompleted && t.estimatedHours && t.dueDate).length} of{' '}
                                {tasks.filter((t) => !t.isCompleted).length} incomplete tasks
                            </div>

                            {tasks.filter((t) => !t.isCompleted && (!t.estimatedHours || !t.dueDate)).length >
                                0 && (
                                    <div className="warning-box" style={{ marginBottom: '1.5rem' }}>
                                        <strong>⚠️ Note:</strong> Some tasks are missing estimated hours or due dates and
                                        will not be included in the schedule.
                                    </div>
                                )}

                            {error && <div className="error-message">{error}</div>}

                            <div className="modal-actions">
                                <button onClick={onClose} className="btn-secondary">
                                    Cancel
                                </button>
                                <button onClick={handleSchedule} disabled={loading} className="btn-primary">
                                    {loading ? 'Analyzing...' : 'Generate Schedule'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="success-message" style={{ marginBottom: '1.5rem' }}>
                                Schedule generated successfully! Here's the recommended task order:
                            </div>

                            <div className="schedule-list">
                                {recommendedOrder.map((taskTitle, index) => {
                                    const task = getTaskByTitle(taskTitle);
                                    return (
                                        <div key={index} className="schedule-item">
                                            <div className="schedule-number">{index + 1}</div>
                                            <div className="schedule-content">
                                                <h4>{taskTitle}</h4>
                                                {task && (
                                                    <div className="schedule-meta">
                                                        <span>⏱️ {task.estimatedHours}h</span>
                                                        <span>
                                                            📅 Due: {new Date(task.dueDate!).toLocaleDateString()}
                                                        </span>
                                                        {task.dependencies && task.dependencies.length > 0 && (
                                                            <span>🔗 {task.dependencies.length} dependencies</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                                <button onClick={onClose} className="btn-primary">
                                    Got it!
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartSchedulerModal;
