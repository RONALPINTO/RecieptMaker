import React from 'react';
import { formatCurrency, calculateRowTotal, formatQuantity } from '../utils/formatters';

export default function ReceiptPreview({ receiptInfo, billNo, dateStr, timeStr, items, summary, onPrint }) {
  const {
    hotelName = 'YES BAITHAK',
    address = 'SHOP NO 17, SARVODYA COMPLEX, SHREE\nGANESH BUILDING, GEETA NAGAR, MIRA ROAD\nEAST, MIRA BHAYANDAR, MAHARASHTRA 401107',
    tableNo = '21',
    custName = 'P',
    paidBy = 'CASH',
    footerMessage = 'THANKS FOR YOUR VISIT! HAPPY JOURNEY',
  } = receiptInfo || {};

  // Group items by category
  const foodItems = items.filter((item) => (item.category || 'FOOD').toUpperCase() === 'FOOD');
  const liquorItems = items.filter((item) => (item.category || 'FOOD').toUpperCase() === 'LIQUOR');
  const otherItems = items.filter(
    (item) => {
      const cat = (item.category || 'FOOD').toUpperCase();
      return cat !== 'FOOD' && cat !== 'LIQUOR';
    }
  );

  const addressLines = address ? address.split('\n') : [];

  return (
    <div className="receipt-preview-container">
      {/* On-screen visual Card header */}
      <div className="preview-card-header no-print">
        <div className="preview-title-group">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h20"/>
            <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/>
            <path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/>
          </svg>
          <h3>80mm Thermal Receipt Preview</h3>
        </div>
        <button
          type="button"
          className="btn btn-primary-sm print-btn-preview"
          onClick={onPrint}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print
        </button>
      </div>

      {/* Realistic 80mm Receipt Paper */}
      <div className="thermal-receipt-paper" id="printable-receipt">
        {/* Jagged paper top decor for screen view */}
        <div className="receipt-zigzag-top no-print" />

        <div className="receipt-content-inner">
          {/* Top Header & Hotel Name */}
          <div className="receipt-header">
            <h2 className="receipt-hotel-name">{hotelName}</h2>
            {addressLines.map((line, idx) => (
              <div key={idx} className="receipt-address-line">{line}</div>
            ))}
          </div>

          <div className="receipt-divider">------------------------------------------------------</div>
          
          <div className="receipt-bill-no">BILL NO: {billNo || '3249'}</div>

          <div className="receipt-divider">------------------------------------------------------</div>

          {/* Table / Date & Cust / Time Meta Info (DYNAMIC DATE & TIME) */}
          <div className="receipt-meta-grid">
            <div className="meta-row">
              <span>TABLE: {tableNo}</span>
              <span>DATE: {dateStr}</span>
            </div>
            <div className="meta-row">
              <span>CUST: {custName}</span>
              <span>TIME: {timeStr}</span>
            </div>
          </div>

          <div className="receipt-divider">------------------------------------------------------</div>

          {/* Table Column Headers */}
          <div className="receipt-table-header">
            <span className="col-desc">DESCRIPTION</span>
            <span className="col-qty">QTY</span>
            <span className="col-rate">RATE</span>
            <span className="col-amt">AMOUNT</span>
          </div>

          <div className="receipt-divider">------------------------------------------------------</div>

          {/* Items Section grouped by category */}
          <div className="receipt-items-list">
            {items.length === 0 ? (
              <div className="receipt-empty-notice">[ No items added ]</div>
            ) : (
              <>
                {/* Food Category Items */}
                {foodItems.length > 0 && (
                  <div className="receipt-category-block">
                    <div className="category-title">---- FOOD ----</div>
                    {foodItems.map((item, idx) => renderItemRow(item, idx))}
                  </div>
                )}

                {/* Liquor Category Items */}
                {liquorItems.length > 0 && (
                  <div className="receipt-category-block">
                    <div className="category-title">---- LIQUOR (VAT 10%) ----</div>
                    {liquorItems.map((item, idx) => renderItemRow(item, idx))}
                  </div>
                )}

                {/* Other Items */}
                {otherItems.length > 0 && (
                  <div className="receipt-category-block">
                    <div className="category-title">---- OTHER ----</div>
                    {otherItems.map((item, idx) => renderItemRow(item, idx))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="receipt-divider">------------------------------------------------------</div>

          {/* Subtotals & Taxes */}
          <div className="receipt-totals-block">
            {foodItems.length > 0 && (
              <div className="summary-row">
                <span>FOOD SUB TOTAL</span>
                <span>{formatCurrency(summary.foodSubTotal)}</span>
              </div>
            )}
            {liquorItems.length > 0 && (
              <div className="summary-row">
                <span>LIQUOR SUB TOTAL</span>
                <span>{formatCurrency(summary.liquorSubTotal)}</span>
              </div>
            )}
            <div className="summary-row font-bold">
              <span>SUB TOTAL</span>
              <span>{formatCurrency(summary.subTotal)}</span>
            </div>
            {summary.cgst > 0 && (
              <div className="summary-row">
                <span>CGST @ 2.5%</span>
                <span>{formatCurrency(summary.cgst)}</span>
              </div>
            )}
            {summary.sgst > 0 && (
              <div className="summary-row">
                <span>SGST @ 2.5%</span>
                <span>{formatCurrency(summary.sgst)}</span>
              </div>
            )}
            {summary.vat > 0 && (
              <div className="summary-row">
                <span>VAT @ 10%</span>
                <span>{formatCurrency(summary.vat)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>(+) FETC ROUNDED</span>
              <span></span>
            </div>
          </div>

          <div className="receipt-divider">------------------------------------------------------</div>

          {/* Grand Total Row */}
          <div className="receipt-grand-total-row">
            <span className="grand-label">TOTAL</span>
            <span className="grand-amount">{formatCurrency(summary.grandTotal)}</span>
          </div>

          <div className="receipt-divider">------------------------------------------------------</div>

          {/* Above prices include taxes note */}
          <div className="receipt-center-notice">
            ABOVE PRICES INCLUDE TAXES
          </div>

          <div className="receipt-divider">------------------------------------------------------</div>

          {/* Tax Summary Block */}
          <div className="receipt-tax-summary">
            <div className="summary-row">
              <span>TOTAL GST</span>
              <span>{formatCurrency(summary.totalGst)}</span>
            </div>
            <div className="summary-row">
              <span>TOTAL VAT (10%)</span>
              <span>{formatCurrency(summary.totalVat)}</span>
            </div>
            <div className="summary-row">
              <span>NON-TAXABLE</span>
              <span>{formatCurrency(summary.nonTaxable)}</span>
            </div>
          </div>

          <div className="receipt-divider">------------------------------------------------------</div>

          {/* Paid By Row */}
          <div className="summary-row font-bold">
            <span>PAID BY:</span>
            <span>{paidBy}</span>
          </div>

          <div className="receipt-divider">------------------------------------------------------</div>

          {/* Footer */}
          <div className="receipt-footer">
            <div className="footer-msg">{footerMessage}</div>
            <div className="footer-time">{timeStr}</div>
          </div>
        </div>

        {/* Jagged paper bottom decor for screen view */}
        <div className="receipt-zigzag-bottom no-print" />
      </div>
    </div>
  );
}


// Helper to render individual item row matching thermal print column width
function renderItemRow(item, idx) {
  const qty = formatQuantity(item.quantity);
  const rate = Number(item.unitPrice) || 0;
  const rowTotal = calculateRowTotal(item.quantity, item.unitPrice);

  const name = item.name.trim() || `Item ${idx + 1}`;
  const isLongName = name.length > 20;

  if (isLongName) {
    return (
      <div key={item.id || idx} className="receipt-item-line long-item">
        <div className="item-name-full">{name}</div>
        <div className="item-details-row">
          <span className="col-desc-spacer"></span>
          <span className="col-qty">{qty}</span>
          <span className="col-rate">{rate}</span>
          <span className="col-amt">{rowTotal}</span>
        </div>
      </div>
    );
  }

  return (
    <div key={item.id || idx} className="receipt-item-line">
      <span className="col-desc">{name}</span>
      <span className="col-qty">{qty}</span>
      <span className="col-rate">{rate}</span>
      <span className="col-amt">{rowTotal}</span>
    </div>
  );
}

