import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

function Home() {
    const isAuthenticated = authService.isAuthenticated();

    return (
        <div className="page">
            <div className="container">
                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
                    <h1 className="page-title" style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-lg)' }}>
                        Blockchain Certificate Issuance System
                    </h1>
                    <p className="page-description" style={{ fontSize: 'var(--font-size-xl)', maxWidth: '800px', margin: '0 auto var(--spacing-xl)' }}>
                        Issue, manage, and verify certificates on the Ethereum blockchain with IPFS storage.
                        Tamper-proof, transparent, and permanent.
                    </p>

                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', marginTop: 'var(--spacing-2xl)' }}>
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="btn btn-primary btn-lg">
                                    Get Started
                                </Link>
                                <Link to="/verify" className="btn btn-outline btn-lg">
                                    Verify Certificate
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" className="btn btn-primary btn-lg">
                                    Go to Dashboard
                                </Link>
                                <Link to="/projects/new" className="btn btn-accent btn-lg">
                                    Create Project
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-lg" style={{ marginTop: 'var(--spacing-3xl)' }}>
                    <div className="card">
                        <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>🔗</div>
                        <h3 className="card-title">Blockchain Verified</h3>
                        <p className="text-muted">
                            Certificates are issued on Ethereum Sepolia testnet, ensuring immutability and transparency.
                        </p>
                    </div>

                    <div className="card">
                        <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>📦</div>
                        <h3 className="card-title">IPFS Storage</h3>
                        <p className="text-muted">
                            Certificate files are stored on IPFS via Pinata, providing decentralized and permanent storage.
                        </p>
                    </div>

                    <div className="card">
                        <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>⚡</div>
                        <h3 className="card-title">Bulk Issuance</h3>
                        <p className="text-muted">
                            Upload Excel files and issue multiple certificates at once with our efficient bulk issuance system.
                        </p>
                    </div>
                </div>

                {/* How It Works */}
                <div style={{ marginTop: 'var(--spacing-3xl)', padding: 'var(--spacing-2xl)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>How It Works</h2>

                    <div className="grid grid-cols-3 gap-lg">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-accent)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'var(--font-size-2xl)',
                                fontWeight: 'var(--font-weight-bold)',
                                margin: '0 auto var(--spacing-md)'
                            }}>1</div>
                            <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Create Project</h4>
                            <p className="text-muted">Set up a new project and upload your student data via Excel</p>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-accent)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'var(--font-size-2xl)',
                                fontWeight: 'var(--font-weight-bold)',
                                margin: '0 auto var(--spacing-md)'
                            }}>2</div>
                            <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Design Template</h4>
                            <p className="text-muted">Upload your certificate template and position the dynamic fields</p>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-accent)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'var(--font-size-2xl)',
                                fontWeight: 'var(--font-weight-bold)',
                                margin: '0 auto var(--spacing-md)'
                            }}>3</div>
                            <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Issue & Verify</h4>
                            <p className="text-muted">Generate certificates, upload to IPFS, and record on blockchain</p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                {!isAuthenticated && (
                    <div style={{ textAlign: 'center', marginTop: 'var(--spacing-3xl)' }}>
                        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Ready to get started?</h3>
                        <Link to="/login" className="btn btn-primary btn-lg">
                            Login with Google
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
