import React, { useState } from 'react';
import { Task } from '../../types/types_task.types';

interface Props {
  task: Task;
  onUpdate: (taskId: string, updates: any) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<Props> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleToggleComplete = () => {
    onUpdate(task.id, { isCompleted: !task.isCompleted });
  };

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onUpdate(task.id, { title: editTitle.trim() });
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString();
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;

  return (
    <div className={`task-item ${task.isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-checkbox">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={handleToggleComplete}
          id={`task-${task.id}`}
        />
        <label htmlFor={`task-${task.id}`}></label>
      </div>

      <div className="task-content">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={handleKeyPress}
            autoFocus
            className="task-title-edit"
          />
        ) : (
          <h4 onClick={() => setIsEditing(true)} className="task-title">
            {task.title}
          </h4>
        )}

        <div className="task-meta">
          <span className={`task-due-date ${isOverdue ? 'overdue-text' : ''}`}>
            {isOverdue && '⚠️ '}
            {formatDate(task.dueDate)}
          </span>
          {task.estimatedHours && (
            <span className="task-hours">⏱️ {task.estimatedHours}h</span>
          )}
          {task.dependencies && task.dependencies.length > 0 && (
            <span className="task-dependencies" title={task.dependencies.join(', ')}>
              🔗 {task.dependencies.length} {task.dependencies.length === 1 ? 'dependency' : 'dependencies'}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button onClick={() => onDelete(task.id)} className="btn-delete" title="Delete task">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
