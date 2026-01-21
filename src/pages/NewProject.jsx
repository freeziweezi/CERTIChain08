import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import storageService from '../services/storageService';

function NewProject() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Project name is required';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Project name must be at least 3 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const newProject = storageService.createProject({
                name: formData.name.trim(),
                description: formData.description.trim()
            });

            // Redirect to edit page
            navigate(`/projects/${newProject.id}/edit`);
        } catch (error) {
            console.error('Error creating project:', error);
            setErrors({ submit: 'Failed to create project. Please try again.' });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page">
            <div className="container container-sm">
                <div className="page-header">
                    <h1 className="page-title">Create New Project</h1>
                    <p className="page-description">Start a new certificate issuance project</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit}>
                        {errors.submit && (
                            <div className="alert alert-error">
                                {errors.submit}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                Project Name <span style={{ color: 'var(--color-error)' }}>*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                placeholder="e.g., Computer Science Graduation 2024"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            {errors.name && (
                                <span className="form-error">{errors.name}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">
                                Description (Optional)
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-textarea"
                                placeholder="Describe your project..."
                                value={formData.description}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                rows="4"
                            />
                        </div>

                        <div className="alert alert-info">
                            <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>
                                <strong>Next Steps:</strong> After creating your project, you'll be able to:
                            </p>
                            <ul style={{ marginTop: 'var(--spacing-sm)', marginBottom: 0, paddingLeft: 'var(--spacing-lg)' }}>
                                <li>Upload student data via Excel</li>
                                <li>Design your certificate template</li>
                                <li>Generate and issue certificates</li>
                            </ul>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end', marginTop: 'var(--spacing-lg)' }}>
                            <button
                                type="button"
                                onClick={() => navigate('/projects')}
                                className="btn btn-outline"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Section */}
                <div className="card mt-lg" style={{ backgroundColor: 'rgba(20, 184, 166, 0.05)', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>💡 Project Tips</h3>
                    <ul style={{ paddingLeft: 'var(--spacing-lg)', margin: 0 }}>
                        <li className="text-muted" style={{ marginBottom: 'var(--spacing-sm)' }}>
                            Choose a descriptive name that identifies the batch or cohort
                        </li>
                        <li className="text-muted" style={{ marginBottom: 'var(--spacing-sm)' }}>
                            All project data is stored locally in your browser
                        </li>
                        <li className="text-muted" style={{ marginBottom: 'var(--spacing-sm)' }}>
                            You can export and import projects for backup
                        </li>
                        <li className="text-muted">
                            Each project can have multiple certificates and templates
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default NewProject;
