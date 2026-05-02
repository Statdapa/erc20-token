// src/components/TransferTokens.jsx
// Komponen untuk mengirim token ke alamat lain

import React, { useState } from "react";

export function TransferTokens({ tokenSymbol, tokenBalance, onTransfer, loading }) {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [addressError, setAddressError] = useState("");

  // Validasi alamat Ethereum (harus format 0x + 40 hex chars)
  const validateAddress = (addr) => {
    if (!addr) return "";
    if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) {
      return "Alamat Ethereum tidak valid";
    }
    return "";
  };

  const handleAddressChange = (e) => {
    const val = e.target.value;
    setToAddress(val);
    setAddressError(validateAddress(val));
  };

  const handleTransfer = async () => {
    const addrErr = validateAddress(toAddress);
    if (addrErr) {
      setAddressError(addrErr);
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      alert("Masukkan jumlah token yang valid!");
      return;
    }
    if (parseFloat(amount) > parseFloat(tokenBalance)) {
      alert("Saldo token tidak cukup!");
      return;
    }

    await onTransfer(toAddress, amount);

    // Reset form setelah berhasil
    setToAddress("");
    setAmount("");
  };

  return (
    <div className="panel">
      <h2 className="panel-title">📤 Transfer Token</h2>
      <p className="panel-desc">
        Kirim {tokenSymbol} ke alamat lain
      </p>

      {/* Saldo tersedia */}
      <div className="available-balance">
        <span>Tersedia: </span>
        <strong>{tokenBalance} {tokenSymbol}</strong>
        <button
          className="btn btn-ghost btn-xs ml-auto"
          onClick={() => setAmount(tokenBalance)}
        >
          MAX
        </button>
      </div>

      {/* Input alamat tujuan */}
      <div className="input-group">
        <label className="input-label">Alamat Tujuan</label>
        <input
          type="text"
          className={`input ${addressError ? "input-error" : ""}`}
          placeholder="0x..."
          value={toAddress}
          onChange={handleAddressChange}
        />
        {addressError && (
          <span className="error-text">{addressError}</span>
        )}
      </div>

      {/* Input jumlah */}
      <div className="input-group">
        <label className="input-label">Jumlah Token</label>
        <input
          type="number"
          className="input"
          placeholder="100"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
        />
        <span className="input-suffix">{tokenSymbol}</span>
      </div>

      <button
        className="btn btn-secondary btn-full"
        onClick={handleTransfer}
        disabled={loading || !toAddress || !amount || !!addressError}
      >
        {loading ? (
          <span className="loading-text">
            <span className="spinner"></span>
            Sending...
          </span>
        ) : (
          `📤 Transfer ${tokenSymbol}`
        )}
      </button>
    </div>
  );
}
