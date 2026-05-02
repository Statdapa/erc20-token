# ⬡ ERC-20 Token — Proyek Portofolio Web3

> Proyek portofolio Web3 lengkap: Smart contract ERC-20 dengan Solidity + OpenZeppelin, di-deploy ke Sepolia Testnet, dengan frontend React + Ethers.js

![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Ethers.js](https://img.shields.io/badge/Ethers.js-6.x-purple)
![Network](https://img.shields.io/badge/Network-Sepolia_Testnet-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📸 Screenshot

> *[Tambahkan screenshot frontend kamu di sini setelah deploy]*

## ✨ Fitur

- 🪙 **ERC-20 Token** — Token standar Ethereum dengan nama, simbol, dan total supply custom
- 💰 **Buy Tokens** — Beli token dengan ETH testnet langsung dari frontend
- 📤 **Transfer Token** — Kirim token ke alamat Ethereum manapun
- 🔥 **Burn Token** — Hapus token dari sirkulasi (via kontrak)
- 👑 **Owner Controls** — Mint token baru, ubah harga, withdraw ETH
- 🦊 **MetaMask Integration** — Connect wallet, ganti jaringan otomatis
- 📊 **Live Blockchain Data** — Semua data diambil langsung dari smart contract

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Smart Contract | Solidity 0.8.20 + OpenZeppelin |
| Development | Hardhat |
| Frontend | React 18 + Vite |
| Web3 Library | Ethers.js v6 |
| Wallet | MetaMask |
| Testnet | Ethereum Sepolia |

## 📁 Struktur Proyek

```
erc20-token/
├── contracts/                  # Smart contract
│   ├── contracts/
│   │   └── MyToken.sol         # Kontrak ERC-20 utama
│   ├── scripts/
│   │   └── deploy.js           # Script deployment
│   ├── hardhat.config.js       # Konfigurasi Hardhat
│   ├── .env.example            # Template environment variables
│   └── package.json
│
├── frontend/                   # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── WalletCard.jsx  # Tampilan wallet info
│   │   │   ├── TokenInfo.jsx   # Info token dari blockchain
│   │   │   ├── BuyTokens.jsx   # Panel beli token
│   │   │   ├── TransferTokens.jsx
│   │   │   └── TxStatus.jsx    # Notifikasi transaksi
│   │   ├── hooks/
│   │   │   └── useWeb3.js      # Custom hook Web3
│   │   ├── utils/
│   │   │   ├── tokenABI.js     # ABI smart contract
│   │   │   └── contractConfig.js # Alamat kontrak
│   │   ├── App.jsx
│   │   └── App.css
│   ├── index.html
│   └── package.json
│
├── deployment.json             # Info deployment (auto-generated)
└── README.md
```

## 🚀 Cara Setup & Deploy

### Prasyarat

- [Node.js](https://nodejs.org) v18+
- [MetaMask](https://metamask.io) browser extension
- Akun [Alchemy](https://www.alchemy.com) (gratis)
- Akun [Etherscan](https://etherscan.io) (opsional, untuk verifikasi)

---

### Step 1: Clone & Install

```bash
git clone https://github.com/yourusername/erc20-token.git
cd erc20-token

# Install dependencies smart contract
cd contracts
npm install

# Install dependencies frontend
cd ../frontend
npm install
```

---

### Step 2: Setup Environment Variables

```bash
cd contracts
cp .env.example .env
```

Edit file `.env`:

```env
# RPC URL dari Alchemy (daftar gratis di alchemy.com)
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Private key wallet (JANGAN share ke siapapun!)
# Gunakan wallet baru/terpisah khusus testing
PRIVATE_KEY=your_private_key_here

# Etherscan API Key (opsional)
ETHERSCAN_API_KEY=your_etherscan_api_key
```

> ⚠️ **PENTING:** Gunakan wallet baru khusus untuk development. Jangan pakai wallet utama!

---

### Step 3: Dapatkan Sepolia ETH (Testnet)

Kamu butuh ETH testnet untuk bayar gas fee deployment. Dapatkan gratis di:

- [Alchemy Sepolia Faucet](https://sepoliafaucet.com) — Paling mudah, butuh akun Alchemy
- [Infura Faucet](https://www.infura.io/faucet/sepolia)
- [Chainlink Faucet](https://faucets.chain.link/sepolia)

---

### Step 4: Compile Smart Contract

```bash
cd contracts
npx hardhat compile
```

Output: folder `artifacts/` yang berisi compiled bytecode dan ABI.

---

### Step 5: Deploy ke Sepolia

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Output contoh:
```
🚀 Memulai proses deployment...

📋 Info Deployer:
   Alamat: 0xYourAddress
   Saldo : 0.5 ETH

🪙 Konfigurasi Token:
   Nama        : My Portfolio Token
   Simbol      : MPT
   Initial Supply: 1,000,000 token

✅ Kontrak berhasil di-deploy!
📍 Alamat Kontrak: 0xContractAddress...
🔗 Lihat di Etherscan: https://sepolia.etherscan.io/address/0x...

💾 Info deployment disimpan ke: deployment.json
📝 Frontend config diupdate: frontend/src/utils/contractConfig.js
```

---

### Step 6: (Opsional) Verifikasi di Etherscan

```bash
npx hardhat verify --network sepolia \
  DEPLOYED_CONTRACT_ADDRESS \
  "My Portfolio Token" "MPT" 1000000
```

Setelah terverifikasi, siapapun bisa baca source code kontrak kamu di Etherscan!

---

### Step 7: Jalankan Frontend

```bash
cd frontend
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

---

## 🔍 Cara Menggunakan App

1. **Connect MetaMask** — Klik tombol "Connect MetaMask"
2. **Ganti ke Sepolia** — MetaMask akan otomatis diminta ganti ke Sepolia testnet
3. **Lihat Info Token** — Panel kiri menampilkan data langsung dari blockchain
4. **Beli Token** — Masukkan jumlah ETH, klik "Beli Token"
5. **Transfer Token** — Masukkan alamat tujuan dan jumlah, klik Transfer

---

## 📖 Penjelasan Kode Penting

### Smart Contract (MyToken.sol)

```solidity
// ERC-20 punya fungsi standar yang wajib ada:
// - name(), symbol(), decimals()
// - totalSupply()
// - balanceOf(address)
// - transfer(address, uint256)
// - approve(address, uint256)
// - allowance(address, address)
// - transferFrom(address, address, uint256)
// OpenZeppelin mengimplementasikan semua ini untuk kita!
```

### Custom Hook (useWeb3.js)

Custom React hook yang mengabstraksi semua logika Web3:
- Koneksi MetaMask
- Pembacaan data dari blockchain
- Pengiriman transaksi
- Penanganan error dan loading state

### ABI (tokenABI.js)

ABI (Application Binary Interface) adalah "kontrak" antara JavaScript dan smart contract — mendefinisikan fungsi apa saja yang bisa dipanggil dan tipe datanya.

---

## 🧪 Testing

```bash
cd contracts

# Jalankan semua test
npx hardhat test

# Test dengan coverage report
npx hardhat coverage
```

---

## 🌐 Deploy Frontend ke Vercel

```bash
cd frontend
npm run build

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## 🔗 Links Berguna

- [OpenZeppelin Docs](https://docs.openzeppelin.com/contracts)
- [Hardhat Docs](https://hardhat.org/docs)
- [Ethers.js v6 Docs](https://docs.ethers.org/v6)
- [Sepolia Etherscan](https://sepolia.etherscan.io)
- [MetaMask Docs](https://docs.metamask.io)
- [Solidity Docs](https://docs.soliditylang.org)

---

## 📚 Konsep Web3 yang Dipelajari

Dengan proyek ini, kamu sudah belajar:

- ✅ **ERC-20 Standard** — Fungsi wajib token Ethereum
- ✅ **OpenZeppelin** — Library smart contract yang aman dan teraudit
- ✅ **Hardhat** — Development environment untuk Ethereum
- ✅ **Ethers.js** — Berinteraksi dengan blockchain dari JavaScript
- ✅ **Provider & Signer** — Konsep koneksi read-only vs write
- ✅ **Gas Fee** — Biaya komputasi di Ethereum
- ✅ **Events** — Cara smart contract "berkomunikasi" dengan frontend
- ✅ **ABI** — Interface antara JavaScript dan smart contract
- ✅ **MetaMask Integration** — Wallet connection di dApp

---

## 🤝 Kontribusi

Pull request dan issue sangat diterima! Ini proyek pembelajaran, jadi pertanyaan newbie pun sangat welcome.

---

## 📝 Lisensi

MIT — bebas digunakan untuk belajar dan portofolio.

---

*Dibuat untuk belajar Web3 & Solidity. Jangan deploy ke mainnet sebelum audit!* 🔐
