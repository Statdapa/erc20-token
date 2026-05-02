// src/components/BuyTokens.jsx
// Komponen untuk membeli token dengan ETH

import React, { useState, useMemo } from "react";

export function BuyTokens({ tokenInfo, onBuy, loading, ethBalance }) {
  const [ethAmount, setEthAmount] = useState("");

  // Hitung estimasi token yang didapat
  // useMemo = hitung ulang hanya jika ethAmount atau tokenPrice berubah
  // Mirip @property yang di-cache di Python
  const estimatedTokens = useMemo(() => {
    if (!ethAmount || !tokenInfo?.tokenPrice || isNaN(ethAmount)) return "0";
    const tokens = parseFloat(ethAmount) / parseFloat(tokenInfo.tokenPrice);
    return tokens.toFixed(2);
  }, [ethAmount, tokenInfo?.tokenPrice]);

  const handleBuy = async () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      alert("Masukkan jumlah ETH yang valid!");
      return;
    }
    if (parseFloat(ethAmount) > parseFloat(ethBalance)) {
      alert("Saldo ETH tidak cukup!");
      return;
    }
    await onBuy(ethAmount);
    setEthAmount(""); // Reset input setelah beli
  };

  // Tombol shortcut jumlah ETH
  const quickAmounts = ["0.001", "0.005", "0.01", "0.05"];

  return (
    <div className="panel">
      <h2 className="panel-title">💰 Beli Token</h2>
      <p className="panel-desc">
        Tukar ETH testnet dengan {tokenInfo?.symbol || "token"}
      </p>

      {/* Harga saat ini */}
      {tokenInfo && (
        <div className="price-display">
          <span>Harga:</span>
          <strong>1 {tokenInfo.symbol} = {tokenInfo.tokenPrice} ETH</strong>
        </div>
      )}

      {/* Input jumlah ETH */}
      <div className="input-group">
        <label className="input-label">Jumlah ETH</label>
        <input
          type="number"
          className="input"
          placeholder="0.01"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          min="0"
          step="0.001"
        />
        <span className="input-suffix">ETH</span>
      </div>

      {/* Tombol shortcut */}
      <div className="quick-amounts">
        {quickAmounts.map((amt) => (
          <button
            key={amt}
            className="btn btn-ghost btn-xs"
            onClick={() => setEthAmount(amt)}
          >
            {amt}
          </button>
        ))}
      </div>

      {/* Estimasi token */}
      {ethAmount && (
        <div className="estimate-box">
          <span>Estimasi diterima:</span>
          <strong>
            ~{estimatedTokens} {tokenInfo?.symbol || "token"}
          </strong>
        </div>
      )}

      <button
        className="btn btn-primary btn-full"
        onClick={handleBuy}
        disabled={loading || !ethAmount}
      >
        {loading ? (
          <span className="loading-text">
            <span className="spinner"></span>
            Processing...
          </span>
        ) : (
          `🪙 Beli Token`
        )}
      </button>

      <p className="panel-note">
        ⚡ Gas fee dibayar dengan ETH testnet (gratis dari faucet)
      </p>
    </div>
  );
}
