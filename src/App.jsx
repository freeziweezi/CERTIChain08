import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import NewProject from './pages/NewProject';
import EditProject from './pages/EditProject';
import ProjectCertificates from './pages/ProjectCertificates';
import Generate from './pages/Generate';
import Verify from './pages/Verify';

function App() {
    return (
        <div className="app">
            <Header />

            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify" element={<Verify />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                <Route path="/projects" element={
                    <ProtectedRoute>
                        <Projects />
                    </ProtectedRoute>
                } />

                <Route path="/projects/new" element={
                    <ProtectedRoute>
                        <NewProject />
                    </ProtectedRoute>
                } />

                <Route path="/projects/:id/edit" element={
                    <ProtectedRoute>
                        <EditProject />
                    </ProtectedRoute>
                } />

                <Route path="/projects/:id/certificates" element={
                    <ProtectedRoute>
                        <ProjectCertificates />
                    </ProtectedRoute>
                } />

                <Route path="/generate" element={
                    <ProtectedRoute>
                        <Generate />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
}

export default App;
