# 🎓 Blockchain Certificate Issuance System

A comprehensive certificate issuance and verification system built with React, Ethereum blockchain (Sepolia testnet), and IPFS storage via Pinata.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Step 1: Deploy Smart Contract on Remix](#step-1-deploy-smart-contract-on-remix)
  - [Step 2: Configure Pinata for IPFS](#step-2-configure-pinata-for-ipfs)
  - [Step 3: Update Config File](#step-3-update-config-file)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

- 🦊 **MetaMask Authentication** - Secure wallet-based login
- 📊 **Excel Data Import** - Bulk upload student data via Excel files
- 🎨 **Drag-and-Drop Template Editor** - Customize certificate templates with visual field positioning
- 🔗 **Blockchain Verification** - Certificates issued on Ethereum Sepolia testnet
- 📦 **IPFS Storage** - Decentralized certificate storage via Pinata
- ⚡ **Bulk Issuance** - Issue multiple certificates in a single transaction
- ✅ **Public Verification** - Anyone can verify certificate authenticity
- 📱 **Multi-Page Routing** - Each feature has its own URL
- 🎯 **Project Management** - Organize certificates into projects

---

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router v6
- **Blockchain**: Web3.js for Ethereum Sepolia
- **Storage**: IPFS via Pinata SDK
- **Authentication**: MetaMask Wallet
- **Excel Parsing**: xlsx library
- **Canvas Editing**: Fabric.js
- **Styling**: Vanilla CSS with design system

---

## 📦 Prerequisites

Before you begin, ensure you have the following:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **MetaMask Wallet** - [Install extension](https://metamask.io/)
   - Create a wallet if you don't have one
   - Switch to Sepolia testnet
   - Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)
3. **Pinata Account** - [Sign up here](https://www.pinata.cloud/)
4. **Remix IDE** - [Access here](https://remix.ethereum.org/)

---

## 📥 Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd certificate-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## ⚙️ Configuration

### Step 1: Deploy Smart Contract on Remix

Your smart contract `CertificateRegistry` should already be deployed. Follow these steps to get the ABI and address:

#### 1.1 - Open Remix IDE
- Go to [https://remix.ethereum.org/](https://remix.ethereum.org/)
- Create a new file or open your existing `CertificateRegistry.sol`

#### 1.2 - Compile the Contract
- Click on the "Solidity Compiler" tab (left sidebar)
- Select compiler version matching your contract
- Click "Compile CertificateRegistry.sol"

#### 1.3 - Copy the ABI
- After compilation, scroll down to the "Compilation Details" section
- Click on "ABI" button
- Copy the entire JSON array (it will look like `[{...}, {...}]`)
- **Save this for later** - you'll need it in Step 4

#### 1.4 - Deploy on Sepolia (if not already deployed)
- Click on "Deploy & Run Transactions" tab
- Change environment to "Injected Provider - MetaMask"
- MetaMask will prompt you to connect - select Sepolia network
- Click "Deploy"
- Confirm the transaction in MetaMask

#### 1.5 - Copy the Contract Address
- After deployment, find your contract under "Deployed Contracts"
- Click the copy icon next to the contract address
- **Save this address** - you'll need it in Step 4

---

### Step 2: Configure Pinata for IPFS

#### 2.1 - Create Pinata Account
- Go to [https://www.pinata.cloud/](https://www.pinata.cloud/)
- Sign up for a free account

#### 2.2 - Generate API Key
- After logging in, go to **API Keys** (from the menu)
- Click **+ New Key**
- Enable the following permissions:
  - ✅ `pinFileToIPFS`
  - ✅ `pinJSONToIPFS`
  - ✅ Unpin (optional)
- Give it a name like "Certificate System"
- Click **Create Key**

#### 2.3 - Copy Your Credentials
You have two options:

**Option A: JWT Token (Recommended)**
- Copy the **JWT** token that appears (starts with `eyJ...`)
- **Save this JWT** - you'll need it in Step 4

**Option B: API Key & Secret**
- Copy the **API Key**
- Copy the **API Secret**
- **Save both** - you'll need them in Step 4

⚠️ **Important**: The JWT/API credentials are shown only once! Save them immediately.

---

### Step 3: Update Config File

Now that you have all the credentials, update the configuration file:

#### 3.1 - Open the Config File
- Navigate to `src/config.js` in your project

#### 3.2 - Update Smart Contract Details
Replace the placeholder values:

```javascript
contract: {
  // Paste your contract address from Remix
  address: '0xYourContractAddressHere',
  
  // Paste your ABI from Remix (the entire JSON array)
  abi: [
    // ... paste ABI here
  ],
  
  // Network config (already set for Sepolia)
  network: {
    name: 'Sepolia',
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    explorer: 'https://sepolia.etherscan.io'
  }
}
```

#### 3.3 - Update Pinata Credentials

```javascript
pinata: {
  // Paste your JWT token
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  
  // OR use API Key/Secret
  apiKey: 'your_api_key_here',
  apiSecret: 'your_api_secret_here',
  
  // These are already set correctly
  apiUrl: 'https://api.pinata.cloud',
  gateway: 'https://gateway.pinata.cloud/ipfs/'
}
```

#### 3.4 - Save the File
- Save `src/config.js`
- Your configuration is now complete!

---

## 🚀 Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   - The app will automatically open at `http://localhost:3000`
   - Or manually navigate to the URL shown in the terminal

3. **Connect MetaMask:**
   - When you try to verify or issue certificates, MetaMask will prompt you
   - Make sure you're on Sepolia testnet
   - Approve the connection

---

## 📖 Usage Guide

### Creating Your First Project

1. **Connect Wallet** - Click "Login" and connect your MetaMask wallet
2. **Create Project** - Click "Create New Project" from the dashboard
3. **Add Details** - Enter project name and description

### Generating Certificates

1. **Navigate to Generate** - Click "Generate" in the navigation
2. **Upload Excel** (Step 1):
   - Prepare an Excel file (.xlsx) with these columns:
     - Student Name
     - Registration Number
     - School Name (or Institution Name)
     - Course Name
   - Drag and drop or click to upload

3. **Design Template** (Step 2):
   - Upload your certificate template (PNG or JPG)
   - Click buttons to add text fields
   - Drag fields to position them on the template
   - Click "Save Template" when done

4. **Generate & Issue** (Step 3):
   - Preview each certificate
   - Use Previous/Next to navigate students
   - Click "Issue This Certificate" for single issuance
   - Or click "Bulk Issue All X Certificates" for batch processing
   - Approve transactions in MetaMask

### Verifying Certificates

1. **Go to Verify Page** - Click "Verify Certificate" (available to everyone)
2. **Enter Certificate ID** - Type the certificate number
3. **View Results** - See student details, issuer, timestamp, and IPFS link

---

## 🌐 Deployment

### Deploy to Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Install Netlify CLI: `npm install -g netlify-cli`
   - Run: `netlify deploy`
   - Follow the prompts
   - For production: `netlify deploy --prod`



### Environment Variables (Production)

For production, you might want to use environment variables:

1. Create `.env` file (add to `.gitignore`):
   ```
   VITE_CONTRACT_ADDRESS=0x...
   VITE_PINATA_JWT=eyJ...
   ```

2. Update `config.js` to use environment variables:
   ```javascript
   contract: {
     address: import.meta.env.VITE_CONTRACT_ADDRESS || '0x...',
     // ...
   }
   ```

---

## 🏗️ Architecture

### Project Structure

```
certificate-system/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Header.jsx       # Navigation header
│   │   ├── ProtectedRoute.jsx
│   │   ├── ExcelUpload.jsx
│   │   ├── TemplateEditor.jsx
│   │   └── CertificateCanvas.jsx
│   ├── pages/               # Route pages
│   │   ├── Home.jsx         # Landing page
│   │   ├── Login.jsx        # MetaMask wallet connection
│   │   ├── Dashboard.jsx    # User dashboard
│   │   ├── Projects.jsx     # Project list
│   │   ├── NewProject.jsx   # Create project
│   │   ├── EditProject.jsx  # Edit project
│   │   ├── ProjectCertificates.jsx
│   │   ├── Generate.jsx     # Certificate generation workflow
│   │   └── Verify.jsx       # Public verification
│   ├── services/            # Business logic
│   │   ├── web3Service.js   # Blockchain interactions
│   │   ├── ipfsService.js   # IPFS/Pinata integration
│   │   ├── authService.js   # MetaMask authentication
│   │   └── storageService.js # LocalStorage management
│   ├── config.js            # Configuration file
│   ├── index.css            # Design system
│   ├── App.jsx              # Router setup
│   └── main.jsx             # Entry point
├── index.html
├── package.json
└── vite.config.js
```

### How It Works

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   User      │─────▶│   React App  │─────▶│  MetaMask   │
│  (Browser)  │      │   (Frontend) │      │   Wallet    │
└─────────────┘      └──────────────┘      └─────────────┘
                            │                      │
                            │                      ▼
                            │              ┌──────────────┐
                            │              │   Ethereum   │
                            │              │   Sepolia    │
                            │              └──────────────┘
                            ▼
                     ┌──────────────┐
                     │    Pinata    │
                     │     IPFS     │
                     └──────────────┘
```

1. **Authentication**: MetaMask wallet connection
2. **Data Storage**: LocalStorage for projects (browser)
3. **Certificate Storage**: IPFS via Pinata (decentralized)
4. **Certificate Registry**: Smart contract on Sepolia (blockchain)
5. **Verification**: Anyone can verify using certificate ID

---

## 🔧 Troubleshooting

### MetaMask Issues

**Problem**: MetaMask not connecting
- **Solution**: Make sure MetaMask is installed and you're on Sepolia network

**Problem**: Transaction fails
- **Solution**: Ensure you have enough Sepolia ETH. Get more from [faucet](https://sepoliafaucet.com/)

### Pinata Issues

**Problem**: "Invalid JWT token"
- **Solution**: Double-check your JWT in `config.js`. Make sure there are no extra spaces

**Problem**: Upload fails
- **Solution**: Check your Pinata account limits. Free tier has upload limits.

### General Issues

**Problem**: "Cannot find module"
- **Solution**: Run `npm install` again

**Problem**: Page is blank
- **Solution**: Check browser console (F12) for errors. Ensure all config values are set.

---

## 📝 Smart Contract Functions Used

The frontend interacts with these smart contract functions:

- `issueCertificate(string studentName, string ipfsHash)` - Issue single certificate
- `bulkIssueCertificates(string[] studentNames, string[] ipfsHashes)` - Bulk issue
- `getCertificate(uint256 certificateId)` - Get certificate details
- `verifyCertificate(uint256 certificateId)` - Verify certificate
- `getCertificatesByIssuer(address issuer)` - Get all certificates by issuer
- `getCurrentCounter()` - Get total certificates issued

---

## 🎨 Design System

The application uses this exact color scheme:

- **Primary**: Deep Navy Blue `#0F172A`
- **Secondary**: Muted Royal Blue `#1E3A8A`
- **Accent**: Soft Teal `#14B8A6`
- **Background**: Off-white `#F8FAFC`
- **Text**: `#111827` / `#6B7280`
- **Success**: `#16A34A`
- **Error**: `#DC2626`

---

## 📄 License

This project is built for educational and certificate issuance purposes.

---

## 🤝 Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review your configuration in `src/config.js`
3. Check browser console (F12) for error messages
4. Ensure MetaMask is connected to Sepolia

---

## 🎉 You're Ready!

Your certificate issuance system is now fully configured. Start by:

1. Running `npm run dev`
2. Connecting your MetaMask wallet
3. Creating your first project
4. Generating certificates

Happy issuing! 🎓
