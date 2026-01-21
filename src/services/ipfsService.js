// ============================================
// IPFS SERVICE - Pinata Integration
// ============================================
import axios from 'axios';
import config from '../config.js';

class IPFSService {
    constructor() {
        this.pinataApiUrl = config.pinata.apiUrl;
        this.pinataJWT = config.pinata.jwt;
        this.gateway = config.pinata.gateway;
    }

    // ============================================
    // Upload File to IPFS via Pinata
    // ============================================
    async uploadFile(file, metadata = {}) {
        try {
            console.log('Uploading file to IPFS:', file.name);

            // Create form data
            const formData = new FormData();
            formData.append('file', file);

            // Add metadata if provided
            if (metadata.name || metadata.description) {
                const pinataMetadata = {
                    name: metadata.name || file.name,
                    keyvalues: {
                        description: metadata.description || 'Certificate',
                        type: metadata.type || 'certificate',
                        timestamp: new Date().toISOString()
                    }
                };
                formData.append('pinataMetadata', JSON.stringify(pinataMetadata));
            }

            // Upload to Pinata
            const response = await axios.post(
                `${this.pinataApiUrl}/pinning/pinFileToIPFS`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${this.pinataJWT}`
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity
                }
            );

            console.log('File uploaded to IPFS:', response.data);

            return {
                success: true,
                ipfsHash: response.data.IpfsHash,
                url: this.getIPFSUrl(response.data.IpfsHash),
                size: response.data.PinSize,
                timestamp: response.data.Timestamp
            };
        } catch (error) {
            console.error('Error uploading to IPFS:', error);

            if (error.response) {
                throw new Error(`IPFS upload failed: ${error.response.data.error || error.response.statusText}`);
            }
            throw new Error('Failed to upload file to IPFS. Please check your Pinata configuration.');
        }
    }

    // ============================================
    // Upload Certificate Image (Base64 or Blob)
    // ============================================
    async uploadCertificateImage(imageData, studentName) {
        try {
            let file;

            // Convert base64 to blob if needed
            if (typeof imageData === 'string' && imageData.startsWith('data:')) {
                const base64Response = await fetch(imageData);
                const blob = await base64Response.blob();
                file = new File([blob], `certificate_${studentName.replace(/\s/g, '_')}.png`, { type: 'image/png' });
            } else if (imageData instanceof Blob) {
                file = new File([imageData], `certificate_${studentName.replace(/\s/g, '_')}.png`, { type: 'image/png' });
            } else {
                throw new Error('Invalid image data format');
            }

            const metadata = {
                name: `Certificate - ${studentName}`,
                description: `Certificate for ${studentName}`,
                type: 'certificate'
            };

            return await this.uploadFile(file, metadata);
        } catch (error) {
            console.error('Error uploading certificate image:', error);
            throw error;
        }
    }

    // ============================================
    // Upload JSON Data to IPFS
    // ============================================
    async uploadJSON(jsonData, fileName = 'data.json') {
        try {
            console.log('Uploading JSON to IPFS');

            const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
            const file = new File([blob], fileName, { type: 'application/json' });

            return await this.uploadFile(file);
        } catch (error) {
            console.error('Error uploading JSON to IPFS:', error);
            throw error;
        }
    }

    // ============================================
    // Get IPFS URL from Hash
    // ============================================
    getIPFSUrl(ipfsHash) {
        return `${this.gateway}${ipfsHash}`;
    }

    // ============================================
    // Fetch Data from IPFS
    // ============================================
    async fetchFromIPFS(ipfsHash) {
        try {
            const url = this.getIPFSUrl(ipfsHash);
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching from IPFS:', error);
            throw new Error('Failed to fetch data from IPFS');
        }
    }

    // ============================================
    // Check Pinata Connection
    // ============================================
    async testConnection() {
        try {
            const response = await axios.get(
                `${this.pinataApiUrl}/data/testAuthentication`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.pinataJWT}`
                    }
                }
            );

            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            console.error('Pinata connection test failed:', error);

            if (error.response && error.response.status === 401) {
                throw new Error('Invalid Pinata JWT token. Please check your configuration.');
            }

            throw new Error('Failed to connect to Pinata. Please check your configuration.');
        }
    }

    // ============================================
    // Get Pinned Files List
    // ============================================
    async getPinnedFiles(limit = 10) {
        try {
            const response = await axios.get(
                `${this.pinataApiUrl}/data/pinList?status=pinned&pageLimit=${limit}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.pinataJWT}`
                    }
                }
            );

            return response.data.rows;
        } catch (error) {
            console.error('Error fetching pinned files:', error);
            throw new Error('Failed to fetch pinned files from Pinata');
        }
    }

    // ============================================
    // Unpin File from IPFS (Optional)
    // ============================================
    async unpinFile(ipfsHash) {
        try {
            await axios.delete(
                `${this.pinataApiUrl}/pinning/unpin/${ipfsHash}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.pinataJWT}`
                    }
                }
            );

            return { success: true };
        } catch (error) {
            console.error('Error unpinning file:', error);
            throw new Error('Failed to unpin file from IPFS');
        }
    }
}

// Export singleton instance
const ipfsService = new IPFSService();
export default ipfsService;
