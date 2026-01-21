import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import web3Service from '../services/web3Service';
import config from '../config';

function Verify() {
    const [searchParams] = useSearchParams();
    const [certificateId, setCertificateId] = useState(searchParams.get('id') || '');
    const [certificate, setCertificate] = useState(null);
    const [isVerified, setIsVerified] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setCertificateId(id);
            handleVerify(id);
        }
    }, [searchParams]);

    const handleVerify = async (id = certificateId) => {
        if (!id || !id.trim()) {
            setError('Please enter a certificate ID');
            return;
        }

        setLoading(true);
        setError(null);
        setCertificate(null);
        setIsVerified(null);

        try {
            // Connect to Web3 if not already connected
            if (!web3Service.isConnected()) {
                await web3Service.connect();
            }

            // Verify certificate
            const verified = await web3Service.verifyCertificate(id.trim());
            setIsVerified(verified);

            if (verified) {
                // Get certificate details
                const certData = await web3Service.getCertificate(id.trim());
                setCertificate(certData);
            } else {
                setError('Certificate is not valid or does not exist');
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError(err.message || 'Failed to verify certificate. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleVerify();
    };

    const formatTimestamp = (timestamp) => {
        return new Date(Number(timestamp) * 1000).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAddress = (address) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const getIPFSUrl = (ipfsHash) => {
        return `${config.pinata.gateway}${ipfsHash}`;
    };

    return (
        <div className="page">
            <div className="container container-sm">
                <div className="page-header" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>✅</div>
                    <h1 className="page-title">Verify Certificate</h1>
                    <p className="page-description">
                        Enter a certificate ID to verify its authenticity on the blockchain
                    </p>
                </div>

                {/* Verification Form */}
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="certificateId" className="form-label">
                                Certificate ID
                            </label>
                            <input
                                type="text"
                                id="certificateId"
                                className="form-input"
                                placeholder="e.g., 1, 2, 3..."
                                value={certificateId}
                                onChange={(e) => setCertificateId(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || !certificateId.trim()}
                            style={{ width: '100%' }}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                'Verify Certificate'
                            )}
                        </button>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {/* Verification Result */}
                {isVerified === true && certificate && (
                    <div className="card" style={{ border: '2px solid var(--color-success)' }}>
                        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-success)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'var(--font-size-3xl)',
                                margin: '0 auto var(--spacing-md)'
                            }}>
                                ✓
                            </div>
                            <h2 style={{ color: 'var(--color-success)', marginBottom: 'var(--spacing-xs)' }}>
                                Certificate Verified
                            </h2>
                            <p className="text-muted">This certificate is valid and registered on the blockchain</p>
                        </div>

                        <div style={{ backgroundColor: 'var(--color-background)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-md)' }}>
                            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Certificate Details</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-sm)', borderBottom: '1px solid var(--color-border)' }}>
                                    <span className="text-muted">Student Name:</span>
                                    <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                                        {certificate.studentName}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-sm)', borderBottom: '1px solid var(--color-border)' }}>
                                    <span className="text-muted">Certificate ID:</span>
                                    <span className="badge badge-success">#{certificateId}</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-sm)', borderBottom: '1px solid var(--color-border)' }}>
                                    <span className="text-muted">Issued By:</span>
                                    <span style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-sm)' }}>
                                        {formatAddress(certificate.issuer)}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-sm)', borderBottom: '1px solid var(--color-border)' }}>
                                    <span className="text-muted">Issue Date:</span>
                                    <span>{formatTimestamp(certificate.timestamp)}</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-sm)', borderBottom: '1px solid var(--color-border)' }}>
                                    <span className="text-muted">Status:</span>
                                    <span className="badge badge-success">Valid</span>
                                </div>

                                {certificate.ipfsHash && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-sm)', borderBottom: '1px solid var(--color-border)' }}>
                                        <span className="text-muted">IPFS Hash:</span>
                                        <a
                                            href={getIPFSUrl(certificate.ipfsHash)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-accent"
                                        >
                                            View Certificate
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {certificate.ipfsHash && (
                            <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
                                <a
                                    href={getIPFSUrl(certificate.ipfsHash)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                >
                                    📄 Download Certificate
                                </a>
                            </div>
                        )}
                    </div>
                )}

                {isVerified === false && (
                    <div className="card" style={{ border: '2px solid var(--color-error)', textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>❌</div>
                        <h2 style={{ color: 'var(--color-error)', marginBottom: 'var(--spacing-sm)' }}>
                            Certificate Not Valid
                        </h2>
                        <p className="text-muted">
                            This certificate ID does not exist or has been revoked
                        </p>
                    </div>
                )}

                {/* Info Section */}
                <div className="card mt-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>ℹ️ How Verification Works</h3>
                    <ul style={{ paddingLeft: 'var(--spacing-lg)', margin: 0 }}>
                        <li className="text-muted" style={{ marginBottom: 'var(--spacing-sm)' }}>
                            Certificate data is stored on the Ethereum Sepolia blockchain
                        </li>
                        <li className="text-muted" style={{ marginBottom: 'var(--spacing-sm)' }}>
                            Certificate files are stored on IPFS for decentralized access
                        </li>
                        <li className="text-muted" style={{ marginBottom: 'var(--spacing-sm)' }}>
                            Verification is instant and tamper-proof
                        </li>
                        <li className="text-muted">
                            You'll need MetaMask to verify certificates
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Verify;
