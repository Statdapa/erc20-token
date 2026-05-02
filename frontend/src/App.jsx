import React from "react";
import { useWeb3 } from "./hooks/useWeb3";
import { WalletCard } from "./components/WalletCard";
import { TokenInfo } from "./components/TokenInfo";
import { BuyTokens } from "./components/BuyTokens";
import { TransferTokens } from "./components/TransferTokens";
import { TxStatus } from "./components/TxStatus";
import "./App.css";

function App() {
  const web3 = useWeb3();

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span>STATDAPA</span>
          </div>
          <div className="network-badge">
            <span className="dot"></span>
            SEPOLIA // TESTNET
          </div>
        </div>
      </header>

      <main className="main">
        {web3.txStatus && <TxStatus status={web3.txStatus} />}

        {web3.error && (
          <div className="error-banner">
            ⚠ {web3.error}
          </div>
        )}

        {!web3.account ? (
          <div className="hero">
            <div className="hero-content">
              <p className="hero-eyebrow">// Web3 Portfolio Project — 2025</p>
              <h1 className="hero-title">
                <span className="line1">STATDAPA</span>
                <span className="line2">TOKEN</span>
              </h1>
              <p className="hero-desc">
                Smart contract ERC-20 on-chain. Deploy, interact, dan transfer
                token langsung dari browser menggunakan MetaMask.
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={web3.connectWallet}
                disabled={web3.loading}
              >
                {web3.loading ? (
                  <span className="loading-text">
                    <span className="spinner"></span>
                    INITIALIZING...
                  </span>
                ) : (
                  <>🦊 CONNECT WALLET</>
                )}
              </button>
              <p className="hint">
                Need Sepolia ETH?{" "}
                <a href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia" target="_blank" rel="noreferrer">
                  Get from faucet →
                </a>
              </p>
            </div>

            <div className="info-cards">
              <div className="info-card">
                <span className="info-icon">📄</span>
                <h3>Smart Contract</h3>
                <p>Solidity 0.8.20 + OpenZeppelin. Deployed on Ethereum Sepolia Testnet.</p>
              </div>
              <div className="info-card">
                <span className="info-icon">🪙</span>
                <h3>ERC-20 Token</h3>
                <p>Standard Ethereum token. Mintable, burnable, transferable.</p>
              </div>
              <div className="info-card">
                <span className="info-icon">⚡</span>
                <h3>Ethers.js v6</h3>
                <p>React frontend dengan real-time blockchain data via MetaMask.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard">
            <WalletCard
              account={web3.account}
              ethBalance={web3.ethBalance}
              tokenBalance={web3.tokenBalance}
              tokenSymbol={web3.tokenInfo?.symbol || "---"}
              onDisconnect={web3.disconnectWallet}
              onRefresh={web3.fetchTokenData}
            />
            <div className="panels-grid">
              <TokenInfo tokenInfo={web3.tokenInfo} />
              <BuyTokens
                tokenInfo={web3.tokenInfo}
                onBuy={web3.buyTokens}
                loading={web3.loading}
                ethBalance={web3.ethBalance}
              />
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
        STATDAPA TOKEN // SEPOLIA TESTNET // WEB3 PORTFOLIO &nbsp;•&nbsp;
        <a href="https://github.com/Statdapa/erc20-token" target="_blank" rel="noreferrer">GITHUB</a>
        &nbsp;•&nbsp;
        <a href="https://sepolia.etherscan.io" target="_blank" rel="noreferrer">ETHERSCAN</a>
      </footer>
    </div>
  );
}

export default App;
