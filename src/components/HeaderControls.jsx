import React from 'react';

export default function HeaderControls({ hotelName, onEditHeaderFooter, onPrint, onItemCount, grandTotalFormatted }) {
  return (
    <header className="app-header no-print">
      <div className="header-brand">
        <div className="brand-logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <div className="brand-info">
          <h1 className="hotel-title-display">{hotelName || "YES BAITHAK"}</h1>
          <p className="app-subtitle">80mm Thermal Receipt Generator</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="btn btn-secondary edit-header-btn"
          onClick={onEditHeaderFooter}
          title="Edit Hotel Name and Thank You Footer Message"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit Header & Footer
        </button>

        <button
          type="button"
          className="btn btn-primary print-receipt-btn"
          onClick={onPrint}
          title="Print 80mm Thermal Receipt (Ctrl+P)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print Receipt
        </button>
      </div>
    </header>
  );
}
