import React, { useState } from 'react';
import { taskService } from '../../services/services_taskService';
import { Task } from '../../types/types_task.types';

interface Props {
  projectId: string;
  existingTasks: Task[];
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

const CreateTaskModal: React.FC<Props> = ({ projectId, existingTasks, onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    isCompleted: false,
    estimatedHours: '8',
    dependencies: [] as string[],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);

    try {
      const task = await taskService.createTask(projectId, {
        title: formData.title.trim(),
        dueDate: formData.dueDate || undefined,
        isCompleted: formData.isCompleted,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : 8,
        dependencies: formData.dependencies.length > 0 ? formData.dependencies : [''],
      });
      onTaskCreated(task);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Task</h2>
          <button onClick={onClose} className="btn-close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
              Task Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              maxLength={200}
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date (optional)</label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="estimatedHours">Estimated Hours (optional)</label>
            <input
              type="number"
              id="estimatedHours"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
              min="1"
              max="1000"
              placeholder="e.g., 8"
            />
            <small>Used for smart scheduling</small>
          </div>

          <div className="form-group">
            <label htmlFor="dependencies">Dependencies (optional)</label>
            <select
              id="dependencies"
              multiple
              value={formData.dependencies}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                setFormData({ ...formData, dependencies: selected });
              }}
              style={{ minHeight: '100px' }}
            >
              {existingTasks
                .filter((t) => !t.isCompleted)
                .map((task) => (
                  <option key={task.id} value={task.title}>
                    {task.title}
                  </option>
                ))}
            </select>
            <small>Hold Ctrl/Cmd to select multiple tasks that must be completed first</small>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="isCompleted"
              checked={formData.isCompleted}
              onChange={(e) => setFormData({ ...formData, isCompleted: e.target.checked })}
            />
            <label htmlFor="isCompleted">Mark as completed</label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
