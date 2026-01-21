// ============================================
// AUTHENTICATION SERVICE - MetaMask Wallet
// ============================================
import config from '../config.js';

class AuthService {
    constructor() {
        this.user = null;
        this.isInitialized = false;
        this.storageKey = `${config.app.storagePrefix}user`;
    }

    // ============================================
    // Initialize Authentication
    // ============================================
    async initialize() {
        if (this.isInitialized) return;

        try {
            // Load user from localStorage if exists
            const savedUser = localStorage.getItem(this.storageKey);
            if (savedUser) {
                this.user = JSON.parse(savedUser);

                // Verify wallet is still connected
                if (window.ethereum) {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (!accounts || accounts.length === 0 || accounts[0].toLowerCase() !== this.user.address.toLowerCase()) {
                        // Wallet disconnected, clear user
                        this.logout();
                    }
                }
            }

            // Listen for account changes
            if (window.ethereum) {
                window.ethereum.on('accountsChanged', (accounts) => {
                    if (accounts.length === 0) {
                        this.logout();
                        window.location.reload();
                    } else if (this.user && accounts[0].toLowerCase() !== this.user.address.toLowerCase()) {
                        // Account changed, update user
                        this.handleAccountChange(accounts[0]);
                    }
                });

                window.ethereum.on('chainChanged', () => {
                    window.location.reload();
                });
            }

            this.isInitialized = true;
        } catch (error) {
            console.error('Error initializing auth service:', error);
        }
    }

    // ============================================
    // Connect MetaMask Wallet
    // ============================================
    async connectWallet() {
        try {
            // Check if MetaMask is installed
            if (!window.ethereum) {
                throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
            }

            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found. Please unlock MetaMask.');
            }

            const address = accounts[0];

            // Create user object
            this.user = {
                address: address,
                shortAddress: this.formatAddress(address),
                loginTime: new Date().toISOString()
            };

            // Save to localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(this.user));

            return this.user;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            throw error;
        }
    }

    // ============================================
    // Handle Account Change
    // ============================================
    async handleAccountChange(newAddress) {
        this.user = {
            address: newAddress,
            shortAddress: this.formatAddress(newAddress),
            loginTime: new Date().toISOString()
        };

        localStorage.setItem(this.storageKey, JSON.stringify(this.user));
        window.location.reload();
    }

    // ============================================
    // Format Address (Shorten)
    // ============================================
    formatAddress(address) {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    // ============================================
    // Logout (Disconnect Wallet)
    // ============================================
    logout() {
        this.user = null;
        localStorage.removeItem(this.storageKey);
    }

    // ============================================
    // Get Current User
    // ============================================
    getCurrentUser() {
        return this.user;
    }

    // ============================================
    // Check if User is Authenticated
    // ============================================
    isAuthenticated() {
        return this.user !== null;
    }

    // ============================================
    // Get Wallet Address
    // ============================================
    getWalletAddress() {
        return this.user?.address || null;
    }

    // ============================================
    // Get Short Address
    // = ===========================================
    getShortAddress() {
        return this.user?.shortAddress || null;
    }

    // ============================================
    // Check MetaMask Installation
    // ============================================
    isMetaMaskInstalled() {
        return typeof window.ethereum !== 'undefined';
    }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
