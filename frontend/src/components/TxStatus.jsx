// src/components/TxStatus.jsx
// Notifikasi status transaksi blockchain

import React from "react";

const STATUS_CONFIG = {
  pending: {
    icon: "⏳",
    text: "Transaksi dikirim ke blockchain...",
    className: "status-pending",
  },
  waiting: {
    icon: "🔄",
    text: "Menunggu konfirmasi block...",
    className: "status-waiting",
  },
  success: {
    icon: "✅",
    text: "Transaksi berhasil dikonfirmasi!",
    className: "status-success",
  },
  failed: {
    icon: "❌",
    text: "Transaksi gagal",
    className: "status-failed",
  },
};

export function TxStatus({ status }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <div className={`tx-status ${config.className}`}>
      <span className="tx-icon">{config.icon}</span>
      <span className="tx-text">{config.text}</span>
      {(status === "pending" || status === "waiting") && (
        <span className="tx-spinner"></span>
      )}
    </div>
  );
}
