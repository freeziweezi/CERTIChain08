import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';

function TemplateEditor({ onTemplateReady }) {
    const [templateImage, setTemplateImage] = useState(null);
    const [canvas, setCanvas] = useState(null);
    const [fields, setFields] = useState({
        studentName: null,
        registrationNumber: null,
        schoolName: null,
        courseName: null
    });
    const canvasRef = useRef(null);

    useEffect(() => {
        if (templateImage && canvasRef.current) {
            initializeCanvas();
        }
    }, [templateImage]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setTemplateImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const initializeCanvas = () => {
        // Clear existing canvas
        if (canvas) {
            canvas.dispose();
        }

        const newCanvas = new fabric.Canvas(canvasRef.current, {
            width: 800,
            height: 600,
            backgroundColor: '#ffffff'
        });

        // Load template image
        fabric.Image.fromURL(templateImage, (img) => {
            // Scale image to fit canvas
            const scale = Math.min(
                newCanvas.width / img.width,
                newCanvas.height / img.height
            );

            img.set({
                scaleX: scale,
                scaleY: scale,
                selectable: false,
                evented: false
            });

            newCanvas.setBackgroundImage(img, newCanvas.renderAll.bind(newCanvas));
        });

        setCanvas(newCanvas);
    };

    const addTextField = (fieldType, label) => {
        if (!canvas) return;

        const text = new fabric.Text(`[${label}]`, {
            left: 100,
            top: 100 + Object.keys(fields).filter(k => fields[k]).length * 60,
            fontSize: 24,
            fontFamily: 'Arial',
            fill: '#000000',
            selectable: true,
            hasControls: true,
            hasBorders: true
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();

        setFields(prev => ({
            ...prev,
            [fieldType]: text
        }));
    };

    const handleSaveTemplate = () => {
        if (!canvas) return;

        const templateConfig = {
            width: canvas.width,
            height: canvas.height,
            fields: {}
        };

        // Save field positions
        Object.keys(fields).forEach(key => {
            if (fields[key]) {
                templateConfig.fields[key] = {
                    left: fields[key].left,
                    top: fields[key].top,
                    fontSize: fields[key].fontSize,
                    fontFamily: fields[key].fontFamily,
                    fill: fields[key].fill
                };
            }
        });

        onTemplateReady({
            image: templateImage,
            config: templateConfig
        });
    };

    const hasAllFields = () => {
        return Object.values(fields).every(field => field !== null);
    };

    return (
        <div>
            {!templateImage ? (
                <div
                    className="file-upload"
                    onClick={() => document.getElementById('templateInput').click()}
                >
                    <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>
                        🖼️
                    </div>
                    <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--spacing-sm)' }}>
                        Upload Certificate Template
                    </p>
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
                        Supported format: PNG, JPG
                    </p>
                    <input
                        id="templateInput"
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                </div>
            ) : (
                <div>
                    <div className="canvas-wrapper">
                        <div className="template-tools">
                            <h4 style={{ margin: 0 }}>Add Fields:</h4>
                            <button
                                onClick={() => addTextField('studentName', 'Student Name')}
                                className={`btn btn-sm ${fields.studentName ? 'btn-success' : 'btn-outline'}`}
                                disabled={!!fields.studentName}
                            >
                                {fields.studentName ? '✓' : '+'} Student Name
                            </button>
                            <button
                                onClick={() => addTextField('registrationNumber', 'Registration Number')}
                                className={`btn btn-sm ${fields.registrationNumber ? 'btn-success' : 'btn-outline'}`}
                                disabled={!!fields.registrationNumber}
                            >
                                {fields.registrationNumber ? '✓' : '+'} Reg. Number
                            </button>
                            <button
                                onClick={() => addTextField('schoolName', 'School Name')}
                                className={`btn btn-sm ${fields.schoolName ? 'btn-success' : 'btn-outline'}`}
                                disabled={!!fields.schoolName}
                            >
                                {fields.schoolName ? '✓' : '+'} School Name
                            </button>
                            <button
                                onClick={() => addTextField('courseName', 'Course Name')}
                                className={`btn btn-sm ${fields.courseName ? 'btn-success' : 'btn-outline'}`}
                                disabled={!!fields.courseName}
                            >
                                {fields.courseName ? '✓' : '+'} Course Name
                            </button>
                        </div>
                        <canvas ref={canvasRef} />
                    </div>

                    <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'space-between' }}>
                        <button
                            onClick={() => setTemplateImage(null)}
                            className="btn btn-outline"
                        >
                            Change Template
                        </button>
                        <button
                            onClick={handleSaveTemplate}
                            className="btn btn-primary"
                            disabled={!hasAllFields()}
                        >
                            {hasAllFields() ? 'Save Template' : 'Add all fields first'}
                        </button>
                    </div>

                    {!hasAllFields() && (
                        <div className="alert alert-info" style={{ marginTop: 'var(--spacing-md)' }}>
                            Please add all 4 fields to the template: Student Name, Registration Number, School Name, and Course Name.
                            Drag the fields to position them on your certificate.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TemplateEditor;
