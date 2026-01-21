import React, { useRef, useEffect } from 'react';

function CertificateCanvas({ templateImage, templateConfig, studentData, onGenerated }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (templateImage && templateConfig && studentData) {
            generateCertificate();
        }
    }, [templateImage, templateConfig, studentData]);

    const generateCertificate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = templateConfig.width || 800;
        canvas.height = templateConfig.height || 600;

        // Load and draw template image
        const img = new Image();
        img.onload = () => {
            // Draw template
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Draw text fields
            Object.keys(templateConfig.fields).forEach(fieldKey => {
                const fieldConfig = templateConfig.fields[fieldKey];
                const value = studentData[fieldKey] || '';

                ctx.font = `${fieldConfig.fontSize}px ${fieldConfig.fontFamily}`;
                ctx.fillStyle = fieldConfig.fill;
                ctx.fillText(value, fieldConfig.left, fieldConfig.top + fieldConfig.fontSize);
            });

            // Notify parent that certificate is ready
            if (onGenerated) {
                canvas.toBlob((blob) => {
                    onGenerated(blob);
                }, 'image/png');
            }
        };

        img.src = templateImage;
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `certificate_${studentData.studentName?.replace(/\s/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div>
            <div className="canvas-wrapper">
                <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
            {studentData && (
                <div style={{ marginTop: 'var(--spacing-md)', textAlign: 'center' }}>
                    <button onClick={handleDownload} className="btn btn-outline">
                        📥 Download Preview
                    </button>
                </div>
            )}
        </div>
    );
}

export default CertificateCanvas;
