import React from 'react';
import { Project } from '../../types/types_project.types';

interface Props {
  project: Project;
  onDelete: (id: string) => void;
  onClick: () => void;
}

const ProjectCard: React.FC<Props> = ({ project, onDelete, onClick }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(project.id);
  };

  const completionRate =
    project.taskCount > 0
      ? Math.round((project.completedTaskCount / project.taskCount) * 100)
      : 0;

  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card-header">
        <h3>{project.title}</h3>
        <button onClick={handleDelete} className="btn-delete" title="Delete project">
          ×
        </button>
      </div>

      {project.description && <p className="project-description">{project.description}</p>}

      <div className="project-stats">
        <div className="stat">
          <span className="stat-label">Tasks:</span>
          <span className="stat-value">{project.taskCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{project.completedTaskCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Progress:</span>
          <span className="stat-value">{completionRate}%</span>
        </div>
      </div>

      {project.taskCount > 0 && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
        </div>
      )}

      <div className="project-date">
        Created: {new Date(project.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ProjectCard;
