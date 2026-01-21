import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import storageService from '../services/storageService';
import authService from '../services/authService';

function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalCertificates: 0,
        recentActivity: []
    });
    const user = authService.getCurrentUser();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = () => {
        const allProjects = storageService.getProjects();
        setProjects(allProjects.slice(0, 5)); // Show only recent 5

        // Calculate stats
        const totalCerts = allProjects.reduce((sum, proj) => sum + (proj.certificates?.length || 0), 0);

        setStats({
            totalProjects: allProjects.length,
            totalCertificates: totalCerts,
            recentActivity: allProjects
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .slice(0, 5)
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Welcome back! 👋</h1>
                    <p className="page-description">Connected: {user?.shortAddress || user?.address}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-lg mb-xl">
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                                    Total Projects
                                </p>
                                <h2 style={{ fontSize: 'var(--font-size-3xl)', margin: 0, color: 'var(--color-primary)' }}>
                                    {stats.totalProjects}
                                </h2>
                            </div>
                            <div style={{ fontSize: 'var(--font-size-3xl)' }}>📁</div>
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                                    Certificates Issued
                                </p>
                                <h2 style={{ fontSize: 'var(--font-size-3xl)', margin: 0, color: 'var(--color-accent)' }}>
                                    {stats.totalCertificates}
                                </h2>
                            </div>
                            <div style={{ fontSize: 'var(--font-size-3xl)' }}>🎓</div>
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xs)' }}>
                                    Quick Actions
                                </p>
                                <Link to="/projects/new" className="btn btn-accent btn-sm" style={{ marginTop: 'var(--spacing-sm)' }}>
                                    Create Project
                                </Link>
                            </div>
                            <div style={{ fontSize: 'var(--font-size-3xl)' }}>⚡</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-lg">
                    {/* Recent Projects */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                            <h2 style={{ fontSize: 'var(--font-size-xl)' }}>Recent Projects</h2>
                            <Link to="/projects" className="btn btn-outline btn-sm">
                                View All
                            </Link>
                        </div>

                        {projects.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                                <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>📂</div>
                                <p className="text-muted">No projects yet</p>
                                <Link to="/projects/new" className="btn btn-primary btn-sm" style={{ marginTop: 'var(--spacing-md)' }}>
                                    Create Your First Project
                                </Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                {projects.map(project => (
                                    <div key={project.id} className="card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{project.name}</h4>
                                                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-sm)' }}>
                                                    {project.description || 'No description'}
                                                </p>
                                                <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)' }}>
                                                    <span>📄 {project.certificates?.length || 0} certificates</span>
                                                    <span>📅 {formatDate(project.updatedAt)}</span>
                                                </div>
                                            </div>
                                            <Link to={`/projects/${project.id}/edit`} className="btn btn-outline btn-sm">
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-lg)' }}>Quick Actions</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            <Link to="/projects/new" className="card" style={{ textDecoration: 'none', display: 'block' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                    <div style={{ fontSize: 'var(--font-size-2xl)' }}>➕</div>
                                    <div>
                                        <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>Create New Project</h4>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                            Start a new certificate issuance project
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link to="/generate" className="card" style={{ textDecoration: 'none', display: 'block' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                    <div style={{ fontSize: 'var(--font-size-2xl)' }}>⚡</div>
                                    <div>
                                        <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>Generate Certificates</h4>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                            Upload Excel and create certificates
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link to="/verify" className="card" style={{ textDecoration: 'none', display: 'block' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                    <div style={{ fontSize: 'var(--font-size-2xl)' }}>✅</div>
                                    <div>
                                        <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>Verify Certificate</h4>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                            Check certificate authenticity
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link to="/projects" className="card" style={{ textDecoration: 'none', display: 'block' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                    <div style={{ fontSize: 'var(--font-size-2xl)' }}>📁</div>
                                    <div>
                                        <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>View All Projects</h4>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                            Browse and manage all your projects
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
