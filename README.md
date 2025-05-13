# Ümit Charity DApp

A transparent, blockchain-powered charity platform. Ümit Charity DApp consists of:

- **Smart Contracts** (Solidity + Hardhat)  
- **Frontend** (Next.js + Thirdweb)  

🔗 **Live Demo:** https://umit-charity.netlify.app

🔗 **LinkedIn:** https://www.linkedin.com/in/dias-kamza

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone git@github.com:kamzadias/umit-charity-dapp.git
cd umit-charity-dapp
```

### 2. Install dependencies

- In one terminal: `blockchain`
```bash
cd blockchain && npm install
```

- In another terminal: `frontend`
```bash
cd ../frontend && npm install
```

### 3. Setup environment variables

```steps
# blockchain
cp blockchain/.env.example blockchain/.env

# frontend
cp frontend/.env.example frontend/.env
```

### 4. Run development environment

1. Start a local Hardhat node
```bash
cd blockchain
npx hardhat node
```

2. In another terminal, launch the Next.js frontend:
```bash
cd ../frontend
npm run dev

```
3. Open the app
- Frontend: http://localhost:3000
- Hardhat UI (if used): http://localhost:8545

## 🧪 Testing

Smart contract tests (Hardhat):
```bash
cd blockchain
npm test
```

Frontend tests (if configured):
```bash
cd frontend
npm run test
```

## 📦 Available Scripts

Run smart contract test suite
```blockchain
npm run test
```

Compile Solidity contracts
```blockchain
npx hardhat compile
```

Start Next.js development server
``` frontend
npm run dev
```

Build production bundle
```frontend
npm run build
```

Serve production build
```frontend
npm run start
```

## 🔧 Configuration

Environment variables: Store sensitive data in .env files. Examples:

blockchain/.env
```frontend
RPC_URL=http://127.0.0.1:8545
```

frontend/.env.local
```frontend
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📝 License

This project is licensed under the MIT License. See LICENSE for details.

