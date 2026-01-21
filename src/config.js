// ============================================
// CONFIGURATION FILE
// ============================================
// IMPORTANT: You must update this file with your actual values after deployment

export const config = {
    // ============================================
    // SMART CONTRACT CONFIGURATION
    // ============================================
    // Get these values from Remix IDE after deploying your contract

    contract: {
        // Replace with your deployed contract address
        address: '0xb27A31f1b0AF2946B7F582768f03239b1eC07c2c',

        // Replace with your contract ABI
        // Copy the ABI from Remix after compilation
        abi: [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "studentName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "ipfsHash",
                        "type": "string"
                    }
                ],
                "name": "issueCertificate",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string[]",
                        "name": "studentNames",
                        "type": "string[]"
                    },
                    {
                        "internalType": "string[]",
                        "name": "ipfsHashes",
                        "type": "string[]"
                    }
                ],
                "name": "bulkIssueCertificates",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "certificateId",
                        "type": "uint256"
                    }
                ],
                "name": "getCertificate",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "studentName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "ipfsHash",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "issuer",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isValid",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "certificateId",
                        "type": "uint256"
                    }
                ],
                "name": "verifyCertificate",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "issuer",
                        "type": "address"
                    }
                ],
                "name": "getCertificatesByIssuer",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getCurrentCounter",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ],

        // Network configuration
        network: {
            name: 'Sepolia',
            chainId: 11155111, // Sepolia testnet chain ID
            rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY', // Optional
            explorer: 'https://sepolia.etherscan.io'
        }
    },

    // ============================================
    // PINATA IPFS CONFIGURATION
    // ============================================
    // Get your API keys from https://app.pinata.cloud/

    pinata: {
        // Replace with your Pinata JWT token
        jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNTFlYjViOC01NzM2LTQzZDQtODkwNy0yYWE1MzZjMmU0YzMiLCJlbWFpbCI6InRhbmlzaHEwOGFtYmFzdGFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjNjMTljOGQ4NzEzZTk5YTEyODdhIiwic2NvcGVkS2V5U2VjcmV0IjoiMjhmNTlhY2Q2ODRlZDZmMWI5ZGY2OTc1YWFmOTRmNTAxNzg0NTk1ODZhOWZmMjVlZjNjZTNmZmU5NDM4ZjhhNyIsImV4cCI6MTgwMDUwNzA4MX0.lIOunxNYO6M5s2jVuunorFd4y5-59Sts-UwzA-HV058',

        // Or use API key and secret
        apiKey: 'YOUR_PINATA_API_KEY',
        apiSecret: 'YOUR_PINATA_API_SECRET',

        // Pinata API endpoint
        apiUrl: 'https://api.pinata.cloud',

        // IPFS Gateway for viewing certificates
        gateway: 'https://gateway.pinata.cloud/ipfs/'
    },

    // ============================================
    // APPLICATION SETTINGS
    // ============================================

    app: {
        name: 'Certificate Issuance System',
        version: '1.0.0',
        // Local storage key prefix
        storagePrefix: 'cert_system_'
    }
};

export default config;
