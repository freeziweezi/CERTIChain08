import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import storageService from '../services/storageService';

function Projects() {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = () => {
        const allProjects = storageService.getProjects();
        setProjects(allProjects);
    };

    const handleDelete = (projectId) => {
        if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            storageService.deleteProject(projectId);
            loadProjects();
        }
    };

    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className="page-title">Your Projects</h1>
                            <p className="page-description">Manage all your certificate issuance projects</p>
                        </div>
                        <Link to="/projects/new" className="btn btn-primary">
                            ➕ Create New Project
                        </Link>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="form-group">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="🔍 Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Projects Grid */}
                {filteredProjects.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-3xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>📂</div>
                        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>
                            {searchTerm ? 'No projects found' : 'No projects yet'}
                        </h3>
                        <p className="text-muted" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            {searchTerm ? 'Try a different search term' : 'Create your first project to get started'}
                        </p>
                        {!searchTerm && (
                            <Link to="/projects/new" className="btn btn-primary">
                                Create Your First Project
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-lg">
                        {filteredProjects.map(project => (
                            <div key={project.id} className="card">
                                <h3 className="card-title">{project.name}</h3>

                                <div className="card-body">
                                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-md)' }}>
                                        {project.description || 'No description provided'}
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
                                            <span>📄</span>
                                            <span className="text-muted">
                                                {project.certificates?.length || 0} certificates
                                            </span>
                                        </div>

                                        {project.excelData && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
                                                <span>📊</span>
                                                <span className="text-muted">
                                                    {project.excelData.length} students
                                                </span>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
                                            <span>📅</span>
                                            <span className="text-muted">
                                                {formatDate(project.updatedAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <Link to={`/projects/${project.id}/edit`} className="btn btn-primary btn-sm">
                                        Edit
                                    </Link>
                                    <Link to={`/projects/${project.id}/certificates`} className="btn btn-outline btn-sm">
                                        Certificates
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats */}
                {filteredProjects.length > 0 && (
                    <div className="card mt-xl" style={{ padding: 'var(--spacing-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-xs)' }}>
                                    {projects.length}
                                </h3>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Total Projects</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-accent)', marginBottom: 'var(--spacing-xs)' }}>
                                    {projects.reduce((sum, p) => sum + (p.certificates?.length || 0), 0)}
                                </h3>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Total Certificates</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                                    {storageService.getStorageUsage().kb} KB
                                </h3>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Storage Used</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Projects;
