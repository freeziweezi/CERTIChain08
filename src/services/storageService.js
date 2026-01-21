// ============================================
// STORAGE SERVICE - LocalStorage Management
// ============================================
import config from '../config.js';

class StorageService {
    constructor() {
        this.storagePrefix = config.app.storagePrefix;
        this.projectsKey = `${this.storagePrefix}projects`;
    }

    // ============================================
    // PROJECT MANAGEMENT
    // ============================================

    // Get all projects
    getProjects() {
        try {
            const projects = localStorage.getItem(this.projectsKey);
            return projects ? JSON.parse(projects) : [];
        } catch (error) {
            console.error('Error getting projects:', error);
            return [];
        }
    }

    // Get project by ID
    getProject(projectId) {
        const projects = this.getProjects();
        return projects.find(p => p.id === projectId);
    }

    // Create new project
    createProject(projectData) {
        try {
            const projects = this.getProjects();

            const newProject = {
                id: this.generateId(),
                name: projectData.name,
                description: projectData.description || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                excelData: null,
                templateImage: null,
                templateConfig: null,
                certificates: []
            };

            projects.push(newProject);
            localStorage.setItem(this.projectsKey, JSON.stringify(projects));

            return newProject;
        } catch (error) {
            console.error('Error creating project:', error);
            throw new Error('Failed to create project');
        }
    }

    // Update project
    updateProject(projectId, updates) {
        try {
            const projects = this.getProjects();
            const index = projects.findIndex(p => p.id === projectId);

            if (index === -1) {
                throw new Error('Project not found');
            }

            projects[index] = {
                ...projects[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem(this.projectsKey, JSON.stringify(projects));
            return projects[index];
        } catch (error) {
            console.error('Error updating project:', error);
            throw new Error('Failed to update project');
        }
    }

    // Delete project
    deleteProject(projectId) {
        try {
            const projects = this.getProjects();
            const filtered = projects.filter(p => p.id !== projectId);
            localStorage.setItem(this.projectsKey, JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('Error deleting project:', error);
            throw new Error('Failed to delete project');
        }
    }

    // ============================================
    // EXCEL DATA MANAGEMENT
    // ============================================

    // Save Excel data to project
    saveExcelData(projectId, excelData) {
        return this.updateProject(projectId, { excelData });
    }

    // Get Excel data from project
    getExcelData(projectId) {
        const project = this.getProject(projectId);
        return project?.excelData || null;
    }

    // ============================================
    // TEMPLATE MANAGEMENT
    // ============================================

    // Save template to project
    saveTemplate(projectId, templateImage, templateConfig) {
        return this.updateProject(projectId, {
            templateImage,
            templateConfig
        });
    }

    // Get template from project
    getTemplate(projectId) {
        const project = this.getProject(projectId);
        return {
            image: project?.templateImage || null,
            config: project?.templateConfig || null
        };
    }

    // ============================================
    // CERTIFICATE MANAGEMENT
    // ============================================

    // Add certificate to project
    addCertificate(projectId, certificateData) {
        try {
            const project = this.getProject(projectId);
            if (!project) {
                throw new Error('Project not found');
            }

            const certificate = {
                id: this.generateId(),
                ...certificateData,
                createdAt: new Date().toISOString()
            };

            const certificates = [...(project.certificates || []), certificate];
            this.updateProject(projectId, { certificates });

            return certificate;
        } catch (error) {
            console.error('Error adding certificate:', error);
            throw new Error('Failed to add certificate');
        }
    }

    // Get certificates from project
    getCertificates(projectId) {
        const project = this.getProject(projectId);
        return project?.certificates || [];
    }

    // Get certificate by ID
    getCertificate(projectId, certificateId) {
        const certificates = this.getCertificates(projectId);
        return certificates.find(c => c.id === certificateId);
    }

    // Update certificate
    updateCertificate(projectId, certificateId, updates) {
        try {
            const project = this.getProject(projectId);
            if (!project) {
                throw new Error('Project not found');
            }

            const certificates = project.certificates.map(cert =>
                cert.id === certificateId ? { ...cert, ...updates } : cert
            );

            this.updateProject(projectId, { certificates });
            return certificates.find(c => c.id === certificateId);
        } catch (error) {
            console.error('Error updating certificate:', error);
            throw new Error('Failed to update certificate');
        }
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    // Generate unique ID
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Clear all data (use with caution)
    clearAllData() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.storagePrefix)) {
                localStorage.removeItem(key);
            }
        });
    }

    // Export project data
    exportProject(projectId) {
        const project = this.getProject(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const dataStr = JSON.stringify(project, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `project_${project.name.replace(/\s/g, '_')}_${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }

    // Import project data
    async importProject(file) {
        try {
            const text = await file.text();
            const projectData = JSON.parse(text);

            // Generate new ID for imported project
            projectData.id = this.generateId();
            projectData.name = `${projectData.name} (Imported)`;

            const projects = this.getProjects();
            projects.push(projectData);
            localStorage.setItem(this.projectsKey, JSON.stringify(projects));

            return projectData;
        } catch (error) {
            console.error('Error importing project:', error);
            throw new Error('Failed to import project');
        }
    }

    // Get storage usage
    getStorageUsage() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key) && key.startsWith(this.storagePrefix)) {
                total += localStorage[key].length + key.length;
            }
        }
        return {
            bytes: total,
            kb: (total / 1024).toFixed(2),
            mb: (total / 1024 / 1024).toFixed(2)
        };
    }
}

// Export singleton instance
const storageService = new StorageService();
export default storageService;
