import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [connecting, setConnecting] = useState(false);

    useEffect(() => {
        // If already authenticated, redirect to dashboard
        if (authService.isAuthenticated()) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleConnectWallet = async () => {
        setConnecting(true);
        setError(null);

        try {
            await authService.connectWallet();
            navigate('/dashboard');
        } catch (err) {
            console.error('Wallet connection error:', err);

            if (err.message.includes('MetaMask is not installed')) {
                setError('MetaMask is not installed. Please install MetaMask extension to continue.');
            } else if (err.code === 4001) {
                setError('Connection request rejected. Please approve the connection in MetaMask.');
            } else {
                setError(err.message || 'Failed to connect wallet. Please try again.');
            }
        } finally {
            setConnecting(false);
        }
    };

    return (
        <div className="page">
            <div className="container container-sm">
                <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>🦊</div>

                    <h1 className="page-title" style={{ marginBottom: 'var(--spacing-md)' }}>
                        Connect Your Wallet
                    </h1>

                    <p className="page-description" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        Connect your MetaMask wallet to access the certificate issuance system
                    </p>

                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'left' }}>
                            {error}
                            {error.includes('not installed') && (
                                <div style={{ marginTop: 'var(--spacing-sm)' }}>
                                    <a
                                        href="https://metamask.io/download/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-accent"
                                        style={{ marginTop: 'var(--spacing-sm)' }}
                                    >
                                        Install MetaMask
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={handleConnectWallet}
                        disabled={connecting}
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%', marginBottom: 'var(--spacing-xl)' }}
                    >
                        {connecting ? (
                            <>
                                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                <span>Connecting...</span>
                            </>
                        ) : (
                            <>
                                <span>🦊</span>
                                <span>Connect MetaMask</span>
                            </>
                        )}
                    </button>

                    <div style={{
                        padding: 'var(--spacing-lg)',
                        backgroundColor: 'rgba(20, 184, 166, 0.05)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(20, 184, 166, 0.2)'
                    }}>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                            <strong>Note:</strong> Your wallet address will be used for authentication. Make sure you're connected to the Sepolia testnet for certificate issuance.
                        </p>
                    </div>
                </div>

                {/* Info Section */}
                <div style={{ marginTop: 'var(--spacing-2xl)', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>What you'll need</h3>
                    <div className="grid grid-cols-3 gap-md">
                        <div className="card">
                            <div style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-sm)' }}>🦊</div>
                            <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>MetaMask Wallet</p>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>For authentication & transactions</p>
                        </div>

                        <div className="card">
                            <div style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-sm)' }}>💰</div>
                            <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Sepolia ETH</p>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>Get test ETH from faucet</p>
                        </div>

                        <div className="card">
                            <div style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-sm)' }}>📜</div>
                            <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Smart Contract</p>
                            <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>Deployed on Sepolia</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
