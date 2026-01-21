import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function ExcelUpload({ onDataParsed }) {
    const [isDragging, setIsDragging] = useState(false);
    const [parsedData, setParsedData] = useState(null);
    const [error, setError] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        setError(null);

        // Validate file type
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            setError('Please upload an Excel file (.xlsx or .xls)');
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Get first sheet
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);

                // Validate required columns
                if (jsonData.length === 0) {
                    setError('Excel file is empty');
                    return;
                }

                // Check for required columns (case-insensitive)
                const firstRow = jsonData[0];
                const keys = Object.keys(firstRow).map(k => k.toLowerCase());

                const requiredFields = ['student name', 'registration number', 'school name', 'course name'];
                const hasAllFields = requiredFields.every(field =>
                    keys.some(key => key.includes(field.split(' ')[0]))
                );

                if (!hasAllFields) {
                    setError('Excel must contain columns: Student Name, Registration Number, School Name, Course Name');
                    return;
                }

                // Normalize the data
                const normalizedData = jsonData.map((row, index) => {
                    const normalized = {};
                    Object.keys(row).forEach(key => {
                        const lowerKey = key.toLowerCase();
                        if (lowerKey.includes('student') && lowerKey.includes('name')) {
                            normalized.studentName = row[key];
                        } else if (lowerKey.includes('registration') || lowerKey.includes('reg')) {
                            normalized.registrationNumber = row[key];
                        } else if (lowerKey.includes('school') || lowerKey.includes('institution')) {
                            normalized.schoolName = row[key];
                        } else if (lowerKey.includes('course')) {
                            normalized.courseName = row[key];
                        }
                    });
                    normalized.id = index + 1;
                    return normalized;
                });

                setParsedData(normalizedData);
                onDataParsed(normalizedData);
            } catch (err) {
                console.error('Error parsing Excel:', err);
                setError('Failed to parse Excel file. Please check the format.');
            }
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <div
                className={`file-upload ${isDragging ? 'dragover' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('excelInput').click()}
            >
                <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>
                    📊
                </div>
                <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--spacing-sm)' }}>
                    Drop Excel file here or click to browse
                </p>
                <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                    Supported format: .xlsx, .xls
                </p>
                <input
                    id="excelInput"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </div>

            {error && (
                <div className="alert alert-error" style={{ marginTop: 'var(--spacing-md)' }}>
                    {error}
                </div>
            )}

            {parsedData && (
                <div className="alert alert-success" style={{ marginTop: 'var(--spacing-md)' }}>
                    ✓ Successfully parsed {parsedData.length} student records
                </div>
            )}

            {parsedData && (
                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Preview Data ({parsedData.length} rows)</h3>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student Name</th>
                                    <th>Registration Number</th>
                                    <th>School/Institution</th>
                                    <th>Course Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parsedData.slice(0, 10).map((row, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{row.studentName}</td>
                                        <td>{row.registrationNumber}</td>
                                        <td>{row.schoolName}</td>
                                        <td>{row.courseName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {parsedData.length > 10 && (
                        <p className="text-muted" style={{ marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
                            Showing first 10 of {parsedData.length} rows
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default ExcelUpload;
