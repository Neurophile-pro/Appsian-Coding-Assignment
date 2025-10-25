import React, { useState } from 'react';
import { projectService } from '../../services/services_projectService';
import { Project } from '../../types/types_project.types';

interface Props {
  onClose: () => void;
  onProjectCreated: (project: Project) => void;
}

const CreateProjectModal: React.FC<Props> = ({ onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.title.length < 1 || formData.title.length > 10) {
      setError('Title must be 1-10 characters');
      return;
    }

    if (formData.description && formData.description.length > 90) {
      setError('Description must be less than 90 characters');
      return;
    }

    setLoading(true);

    try {
      const project = await projectService.createProject({
        title: formData.title,
        description: formData.description || undefined,
      });
      onProjectCreated(project);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Project</h2>
          <button onClick={onClose} className="btn-close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              minLength={1}
              maxLength={10}
              placeholder="Enter Project name"
            />
            <small>{formData.title.length}/10 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={90}
              rows={3}
              placeholder="Enter description"
            />
            <small>{formData.description.length}/90 characters</small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
