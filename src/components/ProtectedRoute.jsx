import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = React.useState(null);

    useEffect(() => {
        authService.initialize().then(() => {
            setIsAuthenticated(authService.isAuthenticated());
        });
    }, []);

    // Loading state
    if (isAuthenticated === null) {
        return (
            <div className="page">
                <div className="container" style={{ textAlign: 'center', paddingTop: '100px' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                    <p style={{ marginTop: '20px', color: 'var(--color-text-muted)' }}>Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Authenticated - render children
    return children;
}

export default ProtectedRoute;
