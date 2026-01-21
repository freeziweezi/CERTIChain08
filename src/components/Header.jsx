import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Header() {
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        authService.initialize().then(() => {
            setUser(authService.getCurrentUser());
        });
    }, []);

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="header-logo">
                        🎓 CertChain
                    </Link>

                    {user && (
                        <nav className="header-nav">
                            <Link
                                to="/dashboard"
                                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/projects"
                                className={`nav-link ${isActive('/projects') && !location.pathname.includes('/new') ? 'active' : ''}`}
                            >
                                Your Projects
                            </Link>
                            <Link
                                to="/projects/new"
                                className={`nav-link ${isActive('/projects/new') ? 'active' : ''}`}
                            >
                                Create New Project
                            </Link>
                            <Link
                                to="/generate"
                                className={`nav-link ${isActive('/generate') ? 'active' : ''}`}
                            >
                                Generate
                            </Link>

                            <div className="user-profile">
                                <span style={{ fontSize: '20px' }}>🦊</span>
                                <span style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                                    {user.shortAddress || user.address}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-sm btn-outline"
                                    style={{ marginLeft: '8px' }}
                                >
                                    Disconnect
                                </button>
                            </div>
                        </nav>
                    )}

                    {!user && (
                        <nav className="header-nav">
                            <Link to="/verify" className={`nav-link ${isActive('/verify') ? 'active' : ''}`}>
                                Verify Certificate
                            </Link>
                            <Link to="/login" className="btn btn-primary btn-sm">
                                Login
                            </Link>
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
