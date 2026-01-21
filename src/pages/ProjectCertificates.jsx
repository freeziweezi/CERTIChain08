import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import storageService from '../services/storageService';
import config from '../config';

function ProjectCertificates() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const proj = storageService.getProject(id);
        if (proj) {
            setProject(proj);
            setCertificates(proj.certificates || []);
        }
    }, [id]);

    const filteredCertificates = certificates.filter(cert =>
        cert.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
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

    const getIPFSUrl = (ipfsHash) => {
        return `${config.pinata.gateway}${ipfsHash}`;
    };

    const getExplorerUrl = (txHash) => {
        return `${config.contract.network.explorer}/tx/${txHash}`;
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

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className="page-title">{project.name} - Certificates</h1>
                            <p className="page-description">View all certificates generated for this project</p>
                        </div>
                        <Link to={`/projects/${id}/edit`} className="btn btn-outline">
                            ← Back to Project
                        </Link>
                    </div>
                </div>

                {certificates.length > 0 && (
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="🔍 Search by student name or registration number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}

                {filteredCertificates.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-3xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>🎓</div>
                        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>
                            {searchTerm ? 'No certificates found' : 'No certificates yet'}
                        </h3>
                        <p className="text-muted" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            {searchTerm ? 'Try a different search term' : 'Generate certificates for this project to see them here'}
                        </p>
                        {!searchTerm && (
                            <Link to="/generate" state={{ projectId: id }} className="btn btn-primary">
                                Generate Certificates
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Reg. Number</th>
                                        <th>School/Institution</th>
                                        <th>Course</th>
                                        <th>Certificate ID</th>
                                        <th>Generated</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCertificates.map(cert => (
                                        <tr key={cert.id}>
                                            <td style={{ fontWeight: 'var(--font-weight-medium)' }}>
                                                {cert.studentName}
                                            </td>
                                            <td>{cert.registrationNumber || '-'}</td>
                                            <td className="text-muted">{cert.schoolName || '-'}</td>
                                            <td className="text-muted">{cert.courseName || '-'}</td>
                                            <td>
                                                {cert.certificateId ? (
                                                    <span className="badge badge-success">
                                                        #{cert.certificateId}
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-error">Pending</span>
                                                )}
                                            </td>
                                            <td className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                                                {formatDate(cert.createdAt)}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                                    {cert.ipfsHash && (
                                                        <a
                                                            href={getIPFSUrl(cert.ipfsHash)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-accent"
                                                            title="View on IPFS"
                                                        >
                                                            📦 IPFS
                                                        </a>
                                                    )}
                                                    {cert.transactionHash && (
                                                        <a
                                                            href={getExplorerUrl(cert.transactionHash)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-primary"
                                                            title="View on Blockchain"
                                                        >
                                                            🔗 TX
                                                        </a>
                                                    )}
                                                    {cert.certificateId && (
                                                        <Link
                                                            to={`/verify?id=${cert.certificateId}`}
                                                            className="btn btn-sm btn-outline"
                                                            title="Verify Certificate"
                                                        >
                                                            ✅
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary */}
                        <div className="card mt-lg" style={{ padding: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-accent)' }}>
                                        {certificates.length}
                                    </h3>
                                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                        Total Certificates
                                    </p>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-success)' }}>
                                        {certificates.filter(c => c.certificateId).length}
                                    </h3>
                                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                        Issued on Blockchain
                                    </p>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-info)' }}>
                                        {certificates.filter(c => c.ipfsHash).length}
                                    </h3>
                                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                        Stored on IPFS
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProjectCertificates;
