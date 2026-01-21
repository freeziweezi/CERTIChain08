import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ExcelUpload from '../components/ExcelUpload';
import TemplateEditor from '../components/TemplateEditor';
import CertificateCanvas from '../components/CertificateCanvas';
import web3Service from '../services/web3Service';
import ipfsService from '../services/ipfsService';
import storageService from '../services/storageService';

function Generate() {
    const location = useLocation();
    const projectId = location.state?.projectId;

    const [step, setStep] = useState(1);
    const [excelData, setExcelData] = useState(null);
    const [template, setTemplate] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [generating, setGenerating] = useState(false);
    const [bulkMode, setBulkMode] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [generatedCerts, setGeneratedCerts] = useState([]);
    const [currentBlob, setCurrentBlob] = useState(null);

    // Step 1: Excel Upload
    const handleExcelParsed = (data) => {
        setExcelData(data);
        setStep(2);
    };

    // Step 2: Template Setup
    const handleTemplateReady = (templateData) => {
        setTemplate(templateData);
        setStep(3);
    };

    // Step 3: Generate Certificate
    const handleCertificateGenerated = (blob) => {
        setCurrentBlob(blob);
    };

    const handleSingleIssue = async () => {
        if (!currentBlob) return;

        setGenerating(true);
        try {
            const studentData = excelData[currentIndex];

            // Upload to IPFS
            const ipfsResult = await ipfsService.uploadCertificateImage(currentBlob, studentData.studentName);

            // Issue on blockchain
            const blockchainResult = await web3Service.issueCertificate(
                studentData.studentName,
                ipfsResult.ipfsHash
            );

            // Save to storage if project exists
            if (projectId) {
                storageService.addCertificate(projectId, {
                    ...studentData,
                    ipfsHash: ipfsResult.ipfsHash,
                    certificateId: blockchainResult.certificateId,
                    transactionHash: blockchainResult.transactionHash
                });
            }

            // Add to generated list
            setGeneratedCerts(prev => [...prev, {
                ...studentData,
                ipfsHash: ipfsResult.ipfsHash,
                certificateId: blockchainResult.certificateId,
                transactionHash: blockchainResult.transactionHash
            }]);

            alert(`✓ Certificate issued successfully!\n\nCertificate ID: ${blockchainResult.certificateId}\nIPFS Hash: ${ipfsResult.ipfsHash}\nTransaction: ${blockchainResult.transactionHash}`);

            // Move to next student
            if (currentIndex < excelData.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setCurrentBlob(null);
            } else {
                alert('All certificates have been processed!');
            }
        } catch (error) {
            console.error('Error issuing certificate:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setGenerating(false);
        }
    };

    const handleBulkIssue = async () => {
        if (!excelData || excelData.length === 0) return;

        setBulkMode(true);
        setGenerating(true);
        setProgress({ current: 0, total: excelData.length });

        const certificates = [];

        try {
            // Generate all certificates and upload to IPFS
            for (let i = 0; i < excelData.length; i++) {
                setProgress({ current: i + 1, total: excelData.length });

                const studentData = excelData[i];

                // Generate certificate image for this student
                const blob = await generateCertificateBlob(studentData);

                // Upload to IPFS
                const ipfsResult = await ipfsService.uploadCertificateImage(blob, studentData.studentName);

                certificates.push({
                    ...studentData,
                    ipfsHash: ipfsResult.ipfsHash
                });
            }

            // Bulk issue on blockchain
            const studentNames = certificates.map(c => c.studentName);
            const ipfsHashes = certificates.map(c => c.ipfsHash);

            const blockchainResult = await web3Service.bulkIssueCertificates(studentNames, ipfsHashes);

            // Update certificates with IDs
            const finalCerts = certificates.map((cert, index) => ({
                ...cert,
                certificateId: blockchainResult.certificateIds[index],
                transactionHash: blockchainResult.transactionHash
            }));

            // Save to storage if project exists
            if (projectId) {
                finalCerts.forEach(cert => {
                    storageService.addCertificate(projectId, cert);
                });
            }

            setGeneratedCerts(finalCerts);
            alert(`✓ Successfully issued ${finalCerts.length} certificates!\n\nTransaction: ${blockchainResult.transactionHash}`);
            setStep(4); // Move to results step
        } catch (error) {
            console.error('Bulk issue error:', error);
            alert(`Error during bulk issuance: ${error.message}`);
        } finally {
            setGenerating(false);
            setBulkMode(false);
        }
    };

    const generateCertificateBlob = (studentData) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = template.config.width || 800;
            canvas.height = template.config.height || 600;

            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                Object.keys(template.config.fields).forEach(fieldKey => {
                    const fieldConfig = template.config.fields[fieldKey];
                    const value = studentData[fieldKey] || '';

                    ctx.font = `${fieldConfig.fontSize}px ${fieldConfig.fontFamily}`;
                    ctx.fillStyle = fieldConfig.fill;
                    ctx.fillText(value, fieldConfig.left, fieldConfig.top + fieldConfig.fontSize);
                });

                canvas.toBlob((blob) => resolve(blob), 'image/png');
            };
            img.src = template.image;
        });
    };

    const currentStudent = excelData ? excelData[currentIndex] : null;

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Generate Certificates</h1>
                    <p className="page-description">Upload data, design template, and issue certificates</p>
                </div>

                {/* Progress Steps */}
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-2xl)', justifyContent: 'center' }}>
                    {[1, 2, 3, 4].map(num => (
                        <div key={num} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: step >= num ? 'var(--color-accent)' : 'var(--color-border)',
                                color: step >= num ? 'white' : 'var(--color-text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'var(--font-weight-bold)'
                            }}>
                                {num}
                            </div>
                            <span className={step >= num ? '' : 'text-muted'} style={{ fontSize: 'var(--font-size-sm)' }}>
                                {num === 1 ? 'Upload Excel' : num === 2 ? 'Design Template' : num === 3 ? 'Generate' : 'Complete'}
                            </span>
                            {num < 4 && <span style={{ color: 'var(--color-border)', margin: '0 var(--spacing-sm)' }}>→</span>}
                        </div>
                    ))}
                </div>

                {/* Step 1: Excel Upload */}
                {step === 1 && (
                    <div className="card">
                        <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Step 1: Upload Student Data</h2>
                        <ExcelUpload onDataParsed={handleExcelParsed} />
                    </div>
                )}

                {/* Step 2: Template Editor */}
                {step === 2 && (
                    <div className="card">
                        <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Step 2: Design Certificate Template</h2>
                        <TemplateEditor onTemplateReady={handleTemplateReady} />
                        <div style={{ marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)' }}>
                            <button onClick={() => setStep(1)} className="btn btn-outline">
                                ← Back to Excel Upload
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Generate & Issue */}
                {step === 3 && currentStudent && (
                    <div className="grid grid-cols-2 gap-lg">
                        <div className="card">
                            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Certificate Preview</h2>
                            <p className="text-muted" style={{ marginBottom: 'var(--spacing-md)' }}>
                                Student {currentIndex + 1} of {excelData.length}
                            </p>

                            <CertificateCanvas
                                templateImage={template.image}
                                templateConfig={template.config}
                                studentData={currentStudent}
                                onGenerated={handleCertificateGenerated}
                            />

                            {/* Navigation */}
                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-lg)' }}>
                                <button
                                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                                    className="btn btn-outline"
                                    disabled={currentIndex === 0}
                                >
                                    ← Previous
                                </button>
                                <button
                                    onClick={() => setCurrentIndex(Math.min(excelData.length - 1, currentIndex + 1))}
                                    className="btn btn-outline"
                                    disabled={currentIndex === excelData.length - 1}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>

                        <div className="card">
                            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Student Details</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                                <div>
                                    <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Student Name:</span>
                                    <p style={{ fontWeight: 'var(--font-weight-semibold)', margin: 0 }}>{currentStudent.studentName}</p>
                                </div>
                                <div>
                                    <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Registration Number:</span>
                                    <p style={{ margin: 0 }}>{currentStudent.registrationNumber}</p>
                                </div>
                                <div>
                                    <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>School/Institution:</span>
                                    <p style={{ margin: 0 }}>{currentStudent.schoolName}</p>
                                </div>
                                <div>
                                    <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>Course Name:</span>
                                    <p style={{ margin: 0 }}>{currentStudent.courseName}</p>
                                </div>
                            </div>

                            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Issue Certificate</h3>

                            <button
                                onClick={handleSingleIssue}
                                className="btn btn-primary"
                                disabled={generating || !currentBlob}
                                style={{ width: '100%', marginBottom: 'var(--spacing-md)' }}
                            >
                                {generating ? '⏳ Issuing...' : '🚀 Issue This Certificate'}
                            </button>

                            <button
                                onClick={handleBulkIssue}
                                className="btn btn-accent"
                                disabled={generating}
                                style={{ width: '100%' }}
                            >
                                {generating ? `⏳ Bulk Issuing... (${progress.current}/${progress.total})` : `⚡ Bulk Issue All ${excelData.length} Certificates`}
                            </button>

                            {generating && bulkMode && (
                                <div style={{ marginTop: 'var(--spacing-md)' }}>
                                    <div className="progress">
                                        <div
                                            className="progress-bar"
                                            style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-muted" style={{ textAlign: 'center', marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
                                        {progress.current} of {progress.total} certificates processed
                                    </p>
                                </div>
                            )}

                            <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border)' }}>
                                <button onClick={() => setStep(2)} className="btn btn-outline" disabled={generating}>
                                    ← Back to Template
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Results */}
                {step === 4 && (
                    <div className="card">
                        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                            <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>🎉</div>
                            <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Certificates Issued Successfully!</h2>
                            <p className="text-muted">{generatedCerts.length} certificates have been issued on the blockchain</p>
                        </div>

                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Certificate ID</th>
                                        <th>IPFS Hash</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generatedCerts.map((cert, index) => (
                                        <tr key={index}>
                                            <td>{cert.studentName}</td>
                                            <td><span className="badge badge-success">#{cert.certificateId}</span></td>
                                            <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>
                                                {cert.ipfsHash.substring(0, 10)}...
                                            </td>
                                            <td>
                                                <a
                                                    href={`${config.pinata.gateway}${cert.ipfsHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-accent"
                                                >
                                                    View
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center' }}>
                            <button onClick={() => window.location.reload()} className="btn btn-primary">
                                Generate More Certificates
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Generate;
