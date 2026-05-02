// src/hooks/useWeb3.js
// Custom React Hook untuk mengelola koneksi Web3
// Hook = fungsi React yang bisa punya state dan side effects
// Mirip seperti class dengan __init__ dan method di Python

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { TOKEN_ABI } from "../utils/tokenABI";
import { CONTRACT_ADDRESS, NETWORK_CHAIN_ID, NETWORK_NAME } from "../utils/contractConfig";
export function useWeb3() {
  // ============================================================
  // STATE — nilai yang bisa berubah dan memicu re-render
  // Seperti variabel instance di Python class
  // ============================================================
  const [account, setAccount] = useState(null);          // Alamat wallet user
  const [provider, setProvider] = useState(null);        // Provider (koneksi ke Ethereum)
  const [signer, setSigner] = useState(null);            // Signer (untuk sign transaksi)
  const [contract, setContract] = useState(null);        // Instance smart contract
  const [tokenBalance, setTokenBalance] = useState("0"); // Saldo token user
  const [ethBalance, setEthBalance] = useState("0");     // Saldo ETH user
  const [tokenInfo, setTokenInfo] = useState(null);      // Info token (nama, simbol, dll)
  const [loading, setLoading] = useState(false);         // Status loading
  const [error, setError] = useState(null);              // Pesan error
  const [txStatus, setTxStatus] = useState(null);        // Status transaksi

  // ============================================================
  // CONNECT METAMASK
  // useCallback = memoize fungsi agar tidak dibuat ulang tiap render
  // ============================================================
  const connectWallet = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      // Cek apakah MetaMask terinstall
      // window.ethereum adalah objek yang diinjeksi MetaMask ke browser
      if (!window.ethereum) {
        throw new Error("MetaMask tidak ditemukan! Install dulu dari metamask.io");
      }

      // Minta izin akses akun dari MetaMask
      // Ini akan memunculkan popup MetaMask
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Buat provider menggunakan MetaMask
      // BrowserProvider = Ethers.js v6 cara connect ke MetaMask
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);

      // Dapatkan signer — diperlukan untuk sign & kirim transaksi
      const web3Signer = await web3Provider.getSigner();
      setSigner(web3Signer);

      // Dapatkan alamat wallet yang sedang aktif
      const userAccount = await web3Signer.getAddress();
      setAccount(userAccount);

      // Cek apakah user di jaringan yang benar (Sepolia)
      const network = await web3Provider.getNetwork();
      if (Number(network.chainId) !== NETWORK_CHAIN_ID) {
        // Minta MetaMask ganti ke Sepolia
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${NETWORK_CHAIN_ID.toString(16)}` }],
          });
        } catch (switchError) {
          // Jika Sepolia belum ada di MetaMask, tambahkan dulu
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: `0x${NETWORK_CHAIN_ID.toString(16)}`,
                chainName: "Sepolia Testnet",
                nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                rpcUrls: ["https://rpc.sepolia.org"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              }],
            });
          } else {
            throw switchError;
          }
        }
      }

      // Buat instance kontrak dengan ABI dan signer
      // Ini seperti membuat objek Python yang bisa memanggil method kontrak
      const tokenContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        TOKEN_ABI,
        web3Signer
      );
      setContract(tokenContract);

    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Gagal connect wallet");
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // FETCH DATA TOKEN
  // Dipanggil setelah wallet connect dan saat refresh data
  // ============================================================
  const fetchTokenData = useCallback(async () => {
    if (!contract || !account || !provider) return;

    try {
      // Panggil banyak fungsi kontrak secara paralel menggunakan Promise.all
      // Lebih efisien daripada await satu per satu (mirip asyncio.gather di Python)
      const [name, symbol, decimals, totalSupply, maxSupply, tokenPrice, balance, ethBal] =
        await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.decimals(),
          contract.totalSupply(),
          contract.maxSupply(),
          contract.tokenPrice(),
          contract.balanceOf(account),
          provider.getBalance(account),
        ]);

      // formatUnits = konversi dari wei ke unit yang bisa dibaca manusia
      // 1 token = 10^18 units (mirip 1 meter = 100 cm)
      setTokenInfo({
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        maxSupply: ethers.formatUnits(maxSupply, decimals),
        tokenPrice: ethers.formatEther(tokenPrice), // dalam ETH
      });

      // Format saldo token: tampilkan 4 desimal
      setTokenBalance(
        parseFloat(ethers.formatUnits(balance, decimals)).toFixed(4)
      );

      // Format saldo ETH: tampilkan 6 desimal
      setEthBalance(
        parseFloat(ethers.formatEther(ethBal)).toFixed(6)
      );
    } catch (err) {
      console.error("Error fetching token data:", err);
      setError("Gagal mengambil data token. Pastikan kontrak sudah di-deploy!");
    }
  }, [contract, account, provider]);

  // ============================================================
  // BUY TOKENS — kirim ETH ke kontrak untuk dapat token
  // ============================================================
  const buyTokens = useCallback(async (ethAmount) => {
    if (!contract || !signer) {
      setError("Wallet belum terconnect!");
      return;
    }

    setLoading(true);
    setTxStatus("pending");
    setError(null);

    try {
      // parseEther = konversi "0.01" ETH ke wei (bigint)
      const ethInWei = ethers.parseEther(ethAmount.toString());

      // Kirim transaksi: panggil buyTokens() dengan mengirim ETH
      // value: = jumlah ETH yang dikirim bersama transaksi
      const tx = await contract.buyTokens({ value: ethInWei });

      setTxStatus("waiting"); // Menunggu konfirmasi block

      // Tunggu 1 konfirmasi block
      const receipt = await tx.wait(1);

      console.log("Transaksi sukses:", receipt.hash);
      setTxStatus("success");

      // Refresh data setelah beli
      await fetchTokenData();

      // Reset status setelah 5 detik
      setTimeout(() => setTxStatus(null), 5000);

      return receipt;
    } catch (err) {
      console.error("Error buying tokens:", err);
      setTxStatus("failed");
      if (err.code === 4001) {
        setError("Transaksi dibatalkan oleh user");
      } else {
        setError(err.message || "Transaksi gagal");
      }
    } finally {
      setLoading(false);
    }
  }, [contract, signer, fetchTokenData]);

  // ============================================================
  // TRANSFER TOKEN ke alamat lain
  // ============================================================
  const transferTokens = useCallback(async (toAddress, amount) => {
    if (!contract || !tokenInfo) return;

    setLoading(true);
    setTxStatus("pending");
    setError(null);

    try {
      // parseUnits = konversi dari angka biasa ke wei-equivalent
      const amountInWei = ethers.parseUnits(
        amount.toString(),
        tokenInfo.decimals
      );

      const tx = await contract.transfer(toAddress, amountInWei);
      setTxStatus("waiting");

      const receipt = await tx.wait(1);
      setTxStatus("success");

      await fetchTokenData();
      setTimeout(() => setTxStatus(null), 5000);

      return receipt;
    } catch (err) {
      console.error("Error transferring tokens:", err);
      setTxStatus("failed");
      setError(err.message || "Transfer gagal");
    } finally {
      setLoading(false);
    }
  }, [contract, tokenInfo, fetchTokenData]);

  // ============================================================
  // DISCONNECT WALLET
  // ============================================================
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setTokenBalance("0");
    setEthBalance("0");
    setTokenInfo(null);
    setTxStatus(null);
    setError(null);
  }, []);

  // ============================================================
  // SIDE EFFECTS — jalankan kode ketika state berubah
  // useEffect seperti callback yang dipanggil setelah render
  // ============================================================

  // Fetch data token ketika contract sudah siap
  useEffect(() => {
    if (contract && account) {
      fetchTokenData();
    }
  }, [contract, account, fetchTokenData]);

  // Listen event dari MetaMask (ganti akun / ganti jaringan)
  useEffect(() => {
    if (!window.ethereum) return;

    // Ketika user ganti akun di MetaMask
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        // Reconnect dengan akun baru
        connectWallet();
      }
    };

    // Ketika user ganti jaringan
    const handleChainChanged = () => {
      // Reload halaman adalah cara paling aman saat ganti chain
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // Cleanup: hapus listener ketika komponen di-unmount
    // Mirip __del__ atau context manager di Python
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [connectWallet, disconnectWallet]);

  // Return semua state dan fungsi yang dibutuhkan komponen
  return {
    account,
    tokenBalance,
    ethBalance,
    tokenInfo,
    loading,
    error,
    txStatus,
    connectWallet,
    disconnectWallet,
    buyTokens,
    transferTokens,
    fetchTokenData,
  };
}
