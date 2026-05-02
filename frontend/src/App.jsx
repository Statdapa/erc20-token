// src/App.jsx
// Komponen utama aplikasi React
// Semua komponen lain di-render di sini

import React from "react";
import { useWeb3 } from "./hooks/useWeb3";
import { WalletCard } from "./components/WalletCard";
import { TokenInfo } from "./components/TokenInfo";
import { BuyTokens } from "./components/BuyTokens";
import { TransferTokens } from "./components/TransferTokens";
import { TxStatus } from "./components/TxStatus";
import "./App.css";

function App() {
  // Gunakan custom hook — semua logika Web3 ada di sini
  const web3 = useWeb3();

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⬡</span>
            <span className="logo-text">TokenLab</span>
          </div>
          <div className="network-badge">
            <span className="dot"></span>
            Sepolia Testnet
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Notifikasi status transaksi */}
        {web3.txStatus && <TxStatus status={web3.txStatus} />}

        {/* Error message */}
        {web3.error && (
          <div className="error-banner">
            <span>⚠️</span> {web3.error}
          </div>
        )}

        {!web3.account ? (
          // ============================================================
          // TAMPILAN SEBELUM CONNECT WALLET
          // ============================================================
          <div className="hero">
            <div className="hero-content">
              <h1 className="hero-title">
                Your First
                <br />
                <span className="gradient-text">ERC-20 Token</span>
              </h1>
              <p className="hero-desc">
                Proyek portofolio Web3 — buat, deploy, dan interact
                dengan smart contract ERC-20 di Sepolia Testnet
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={web3.connectWallet}
                disabled={web3.loading}
              >
                {web3.loading ? (
                  <span className="loading-text">
                    <span className="spinner"></span>
                    Connecting...
                  </span>
                ) : (
                  <>🦊 Connect MetaMask</>
                )}
              </button>
              <p className="hint">
                Butuh Sepolia ETH?{" "}
                <a
                  href="https://sepoliafaucet.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Kunjungi faucet →
                </a>
              </p>
            </div>

            {/* Info card untuk pemula */}
            <div className="info-cards">
              <div className="info-card">
                <span className="info-icon">📝</span>
                <h3>Smart Contract</h3>
                <p>Ditulis dalam Solidity, di-deploy ke Ethereum Sepolia Testnet</p>
              </div>
              <div className="info-card">
                <span className="info-icon">🪙</span>
                <h3>ERC-20 Token</h3>
                <p>Standard token Ethereum. Bisa transfer, beli, dan burn</p>
              </div>
              <div className="info-card">
                <span className="info-icon">⚡</span>
                <h3>Ethers.js</h3>
                <p>Library JavaScript untuk berinteraksi dengan blockchain</p>
              </div>
            </div>
          </div>
        ) : (
          // ============================================================
          // TAMPILAN SETELAH CONNECT WALLET
          // ============================================================
          <div className="dashboard">
            {/* Wallet info */}
            <WalletCard
              account={web3.account}
              ethBalance={web3.ethBalance}
              tokenBalance={web3.tokenBalance}
              tokenSymbol={web3.tokenInfo?.symbol || "---"}
              onDisconnect={web3.disconnectWallet}
              onRefresh={web3.fetchTokenData}
            />

            {/* Grid untuk panel interaksi */}
            <div className="panels-grid">
              {/* Info token dari blockchain */}
              <TokenInfo tokenInfo={web3.tokenInfo} />

              {/* Panel beli token */}
              <BuyTokens
                tokenInfo={web3.tokenInfo}
                onBuy={web3.buyTokens}
                loading={web3.loading}
                ethBalance={web3.ethBalance}
              />

              {/* Panel transfer token */}
              <TransferTokens
                tokenSymbol={web3.tokenInfo?.symbol || "---"}
                tokenBalance={web3.tokenBalance}
                onTransfer={web3.transferTokens}
                loading={web3.loading}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          Dibuat dengan ❤️ untuk belajar Web3 •{" "}
          <a
            href="https://github.com/yourusername/erc20-token"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>{" "}
          •{" "}
          <a
            href="https://sepolia.etherscan.io"
            target="_blank"
            rel="noreferrer"
          >
            Etherscan
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
