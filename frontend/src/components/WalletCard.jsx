// src/components/WalletCard.jsx
// Komponen untuk menampilkan info wallet yang sudah terconnect

import React from "react";

// Props = parameter yang diterima komponen dari parent
// Mirip argumen fungsi di Python
export function WalletCard({
  account,
  ethBalance,
  tokenBalance,
  tokenSymbol,
  onDisconnect,
  onRefresh,
}) {
  // Fungsi untuk menyingkat alamat wallet
  // e.g. "0x1234...5678"
  const shortAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Salin alamat ke clipboard
  const copyAddress = async () => {
    await navigator.clipboard.writeText(account);
    alert("Alamat disalin! ✅");
  };

  return (
    <div className="wallet-card">
      <div className="wallet-header">
        <div className="wallet-status">
          <span className="status-dot"></span>
          <span>Wallet Terconnect</span>
        </div>
        <div className="wallet-actions">
          <button className="btn btn-ghost btn-sm" onClick={onRefresh}>
            🔄 Refresh
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={onDisconnect}
          >
            Disconnect
          </button>
        </div>
      </div>

      <div className="wallet-address" onClick={copyAddress} title="Klik untuk copy">
        <span className="address-icon">🦊</span>
        <span className="address-text">{shortAddress(account)}</span>
        <span className="copy-hint">📋</span>
      </div>

      <div className="balance-grid">
        <div className="balance-item">
          <span className="balance-label">Saldo ETH</span>
          <span className="balance-value">{ethBalance}</span>
          <span className="balance-unit">ETH</span>
        </div>
        <div className="balance-divider"></div>
        <div className="balance-item">
          <span className="balance-label">Saldo Token</span>
          <span className="balance-value highlight">{tokenBalance}</span>
          <span className="balance-unit">{tokenSymbol}</span>
        </div>
      </div>
    </div>
  );
}
