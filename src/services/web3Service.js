// ============================================
// WEB3 SERVICE - Ethereum/Sepolia Integration
// ============================================
import Web3 from 'web3';
import config from '../config.js';

class Web3Service {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.account = null;
    }

    // ============================================
    // Initialize Web3 and Connect MetaMask
    // ============================================
    async connect() {
        try {
            // Check if MetaMask is installed
            if (!window.ethereum) {
                throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
            }

            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            this.account = accounts[0];

            // Initialize Web3
            this.web3 = new Web3(window.ethereum);

            // Check if connected to Sepolia network
            const chainId = await this.web3.eth.getChainId();
            if (Number(chainId) !== config.contract.network.chainId) {
                // Try to switch to Sepolia
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: this.web3.utils.toHex(config.contract.network.chainId) }],
                    });
                } catch (switchError) {
                    // If network doesn't exist, add it
                    if (switchError.code === 4902) {
                        throw new Error('Please add Sepolia network to MetaMask');
                    }
                    throw switchError;
                }
            }

            // Initialize contract
            this.contract = new this.web3.eth.Contract(
                config.contract.abi,
                config.contract.address
            );

            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
                this.account = accounts[0];
                window.location.reload(); // Reload on account change
            });

            // Listen for chain changes
            window.ethereum.on('chainChanged', () => {
                window.location.reload(); // Reload on chain change
            });

            return {
                account: this.account,
                network: config.contract.network.name
            };
        } catch (error) {
            console.error('Error connecting to Web3:', error);
            throw error;
        }
    }

    // ============================================
    // Get Current Connected Account
    // ============================================
    async getCurrentAccount() {
        if (!this.account) {
            await this.connect();
        }
        return this.account;
    }

    // ============================================
    // Check if Wallet is Connected
    // ============================================
    isConnected() {
        return this.web3 !== null && this.account !== null;
    }

    // ============================================
    // Issue Single Certificate
    // ============================================
    async issueCertificate(studentName, ipfsHash) {
        try {
            if (!this.isConnected()) {
                await this.connect();
            }

            console.log('Issuing certificate:', { studentName, ipfsHash });

            const result = await this.contract.methods
                .issueCertificate(studentName, ipfsHash)
                .send({ from: this.account });

            console.log('Certificate issued:', result);

            // Extract certificate ID from events or return value
            const certificateId = result.events?.CertificateIssued?.returnValues?.certificateId ||
                result.events?.CertificateIssued?.returnValues?.[0];

            return {
                success: true,
                certificateId: certificateId ? certificateId.toString() : null,
                transactionHash: result.transactionHash,
                blockNumber: result.blockNumber
            };
        } catch (error) {
            console.error('Error issuing certificate:', error);
            throw new Error(error.message || 'Failed to issue certificate');
        }
    }

    // ============================================
    // Bulk Issue Certificates
    // ============================================
    async bulkIssueCertificates(studentNames, ipfsHashes, onProgress) {
        try {
            if (!this.isConnected()) {
                await this.connect();
            }

            if (studentNames.length !== ipfsHashes.length) {
                throw new Error('Student names and IPFS hashes arrays must have the same length');
            }

            console.log('Bulk issuing certificates:', { count: studentNames.length });

            // Send transaction
            const result = await this.contract.methods
                .bulkIssueCertificates(studentNames, ipfsHashes)
                .send({
                    from: this.account,
                    // Monitor transaction progress if callback provided
                    ...(onProgress && {
                        // This is a workaround as Web3 doesn't directly support progress
                        // The actual progress will be tracked via transaction confirmation
                    })
                });

            console.log('Bulk certificates issued:', result);

            // Extract certificate IDs from events
            const certificateIds = result.events?.CertificatesIssued?.returnValues?.certificateIds ||
                result.events?.CertificatesIssued?.returnValues?.[0] || [];

            return {
                success: true,
                certificateIds: certificateIds.map(id => id.toString()),
                transactionHash: result.transactionHash,
                blockNumber: result.blockNumber,
                count: studentNames.length
            };
        } catch (error) {
            console.error('Error bulk issuing certificates:', error);
            throw new Error(error.message || 'Failed to bulk issue certificates');
        }
    }

    // ============================================
    // Get Certificate by ID
    // ============================================
    async getCertificate(certificateId) {
        try {
            if (!this.isConnected()) {
                await this.connect();
            }

            console.log('Fetching certificate:', certificateId);

            const result = await this.contract.methods
                .getCertificate(certificateId)
                .call();

            return {
                studentName: result.studentName || result[0],
                ipfsHash: result.ipfsHash || result[1],
                issuer: result.issuer || result[2],
                timestamp: result.timestamp || result[3],
                isValid: result.isValid || result[4]
            };
        } catch (error) {
            console.error('Error fetching certificate:', error);
            throw new Error('Certificate not found or error fetching data');
        }
    }

    // ============================================
    // Verify Certificate
    // ============================================
    async verifyCertificate(certificateId) {
        try {
            if (!this.isConnected()) {
                await this.connect();
            }

            console.log('Verifying certificate:', certificateId);

            const isValid = await this.contract.methods
                .verifyCertificate(certificateId)
                .call();

            return Boolean(isValid);
        } catch (error) {
            console.error('Error verifying certificate:', error);
            return false;
        }
    }

    // ============================================
    // Get Certificates by Issuer
    // ============================================
    async getCertificatesByIssuer(issuerAddress) {
        try {
            if (!this.isConnected()) {
                await this.connect();
            }

            const address = issuerAddress || this.account;
            console.log('Fetching certificates for issuer:', address);

            const certificateIds = await this.contract.methods
                .getCertificatesByIssuer(address)
                .call();

            return certificateIds.map(id => id.toString());
        } catch (error) {
            console.error('Error fetching certificates by issuer:', error);
            throw new Error('Failed to fetch certificates');
        }
    }

    // ============================================
    // Get Current Counter
    // ============================================
    async getCurrentCounter() {
        try {
            if (!this.isConnected()) {
                await this.connect();
            }

            const counter = await this.contract.methods
                .getCurrentCounter()
                .call();

            return counter.toString();
        } catch (error) {
            console.error('Error fetching counter:', error);
            throw new Error('Failed to fetch counter');
        }
    }

    // ============================================
    // Get Transaction Receipt
    // ============================================
    async getTransactionReceipt(txHash) {
        try {
            if (!this.web3) {
                await this.connect();
            }

            return await this.web3.eth.getTransactionReceipt(txHash);
        } catch (error) {
            console.error('Error fetching transaction receipt:', error);
            throw error;
        }
    }

    // ============================================
    // Get Block Explorer URL
    // ============================================
    getExplorerUrl(txHash) {
        return `${config.contract.network.explorer}/tx/${txHash}`;
    }

    // ============================================
    // Format Address (Shorten)
    // ============================================
    formatAddress(address) {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
}

// Export singleton instance
const web3Service = new Web3Service();
export default web3Service;
