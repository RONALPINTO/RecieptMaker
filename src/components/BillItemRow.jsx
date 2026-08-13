import React from 'react';
import { formatCurrency, calculateRowTotal } from '../utils/formatters';

export default function BillItemRow({
  item,
  index,
  onUpdateItem,
  onDeleteItem,
  onEnterOnLastRow,
  isLastRow,
}) {
  const rowTotal = calculateRowTotal(item.quantity, item.unitPrice);

  const handleNameChange = (e) => {
    onUpdateItem(item.id, { name: e.target.value });
  };

  const handleCategoryChange = (e) => {
    onUpdateItem(item.id, { category: e.target.value });
  };

  const handleQuantityChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      onUpdateItem(item.id, { quantity: '' });
      return;
    }
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateItem(item.id, { quantity: parsed });
    } else if (val === '.') {
      onUpdateItem(item.id, { quantity: '0.' });
    }
  };

  const handleUnitPriceChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      onUpdateItem(item.id, { unitPrice: '' });
      return;
    }
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateItem(item.id, { unitPrice: parsed });
    }
  };

  const handlePriceKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isLastRow && onEnterOnLastRow) {
        onEnterOnLastRow(item.category || 'FOOD');
      }
    }
  };

  return (
    <tr className="bill-item-row">
      <td className="col-food-item">
        <input
          type="text"
          className="form-control item-name-input"
          placeholder="e.g. channa chat"
          value={item.name}
          onChange={handleNameChange}
          autoFocus={index === 0 && item.name === ''}
        />
      </td>

      <td className="col-category">
        <select
          className="form-control category-select"
          value={item.category || 'FOOD'}
          onChange={handleCategoryChange}
        >
          <option value="FOOD">FOOD (5% GST)</option>
          <option value="LIQUOR">LIQUOR (10% VAT)</option>
        </select>
      </td>

      <td className="col-quantity">
        <div className="input-with-stepper">
          <input
            type="number"
            step="any"
            min="0.01"
            className="form-control qty-input"
            placeholder="1"
            value={item.quantity}
            onChange={handleQuantityChange}
          />
        </div>
      </td>

      <td className="col-unit-price">
        <div className="input-currency-wrapper">
          <span className="currency-prefix">₹</span>
          <input
            type="number"
            step="any"
            min="0"
            className="form-control price-input"
            placeholder="0"
            value={item.unitPrice}
            onChange={handleUnitPriceChange}
            onKeyDown={handlePriceKeyDown}
          />
        </div>
      </td>

      <td className="col-row-total">
        <span className="row-total-value">
          {formatCurrency(rowTotal)}
        </span>
      </td>

      <td className="col-action">
        <button
          type="button"
          className="btn-delete-row"
          onClick={() => onDeleteItem(item.id)}
          title="Remove Item"
          aria-label={`Remove ${item.name || 'item'}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </button>
      </td>
    </tr>
  );
}

