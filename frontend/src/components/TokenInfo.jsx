// src/components/TokenInfo.jsx
// Menampilkan informasi token yang diambil langsung dari blockchain

import React from "react";

export function TokenInfo({ tokenInfo }) {
  if (!tokenInfo) {
    return (
      <div className="panel">
        <h2 className="panel-title">📊 Info Token</h2>
        <div className="loading-placeholder">
          <div className="skeleton"></div>
          <div className="skeleton"></div>
          <div className="skeleton"></div>
        </div>
      </div>
    );
  }

  // Format angka besar dengan pemisah ribuan
  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString("id-ID", {
      maximumFractionDigits: 0,
    });
  };

  // Hitung persentase supply yang sudah beredar
  const supplyPercent = (
    (parseFloat(tokenInfo.totalSupply) / parseFloat(tokenInfo.maxSupply)) *
    100
  ).toFixed(2);

  const rows = [
    { label: "Nama Token", value: tokenInfo.name },
    { label: "Simbol", value: tokenInfo.symbol },
    { label: "Desimal", value: tokenInfo.decimals },
    {
      label: "Harga",
      value: `${tokenInfo.tokenPrice} ETH / token`,
    },
    {
      label: "Total Beredar",
      value: `${formatNumber(tokenInfo.totalSupply)} ${tokenInfo.symbol}`,
    },
    {
      label: "Max Supply",
      value: `${formatNumber(tokenInfo.maxSupply)} ${tokenInfo.symbol}`,
    },
  ];

  return (
    <div className="panel">
      <h2 className="panel-title">📊 Info Token</h2>
      <p className="panel-desc">Data langsung dari smart contract</p>

      <div className="info-rows">
        {rows.map(({ label, value }) => (
          <div className="info-row" key={label}>
            <span className="info-label">{label}</span>
            <span className="info-value">{value}</span>
          </div>
        ))}
      </div>

      {/* Progress bar supply */}
      <div className="supply-progress">
        <div className="progress-header">
          <span>Supply Beredar</span>
          <span>{supplyPercent}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${supplyPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
