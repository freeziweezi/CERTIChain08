import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import storageService from '../services/storageService';

function EditProject() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const proj = storageService.getProject(id);
        if (!proj) {
            navigate('/projects');
            return;
        }
        setProject(proj);
        setFormData({
            name: proj.name,
            description: proj.description || ''
        });
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Project name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            storageService.updateProject(id, {
                name: formData.name.trim(),
                description: formData.description.trim()
            });
            navigate('/projects');
        } catch (error) {
            console.error('Error updating project:', error);
            setErrors({ submit: 'Failed to update project' });
            setIsSubmitting(false);
        }
    };

    if (!project) {
        return (
            <div className="page">
                <div className="container">
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="page">
            <div className="container container-sm">
                <div className="page-header">
                    <h1 className="page-title">Edit Project</h1>
                    <p className="page-description">Update project details and settings</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit}>
                        {errors.submit && (
                            <div className="alert alert-error">{errors.submit}</div>
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
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isSubmitting}
                            />
                            {errors.name && <span className="form-error">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-textarea"
                                value={formData.description}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                rows="4"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
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
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Project Stats */}
                <div className="card mt-lg">
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Project Information</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-muted">Created:</span>
                            <span>{formatDate(project.createdAt)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-muted">Last Updated:</span>
                            <span>{formatDate(project.updatedAt)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-muted">Certificates:</span>
                            <span className="badge badge-info">{project.certificates?.length || 0}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="text-muted">Students:</span>
                            <span className="badge badge-info">{project.excelData?.length || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card mt-lg">
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                        <Link to={`/projects/${id}/certificates`} className="btn btn-outline">
                            📄 View Certificates
                        </Link>
                        <Link to="/generate" state={{ projectId: id }} className="btn btn-accent">
                            ⚡ Generate Certificates
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProject;
