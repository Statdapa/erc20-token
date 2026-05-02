// src/utils/tokenABI.js
// ABI = Application Binary Interface
// Ini adalah "daftar menu" fungsi yang bisa kita panggil dari kontrak
// Ethers.js membutuhkan ABI ini untuk berkomunikasi dengan smart contract

export const TOKEN_ABI = [
  // ============================================================
  // READ FUNCTIONS (tidak mengubah state, gratis/tidak perlu gas)
  // ============================================================

  // Nama token
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },

  // Simbol token (e.g. "MPT")
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },

  // Jumlah desimal (default 18 di ERC-20)
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },

  // Total supply semua token yang sudah ada
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },

  // Cek saldo token milik alamat tertentu
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },

  // Harga token saat ini (dalam wei)
  {
    inputs: [],
    name: "tokenPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },

  // Maximum supply
  {
    inputs: [],
    name: "maxSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },

  // Saldo ETH di kontrak
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },

  // ============================================================
  // WRITE FUNCTIONS (mengubah state blockchain, perlu gas fee)
  // ============================================================

  // Transfer token ke alamat lain
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },

  // Beli token dengan ETH (payable = bisa terima ETH)
  {
    inputs: [],
    name: "buyTokens",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },

  // ============================================================
  // EVENTS — "notifikasi" dari blockchain ke frontend
  // ============================================================

  // Event ketika token di-transfer
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },

  // Event ketika token dibeli
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "buyer", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "ethPaid", type: "uint256" },
    ],
    name: "TokensMinted",
    type: "event",
  },
];