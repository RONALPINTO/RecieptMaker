import React from 'react';
import BillItemRow from './BillItemRow';
import ItemAutocomplete from './ItemAutocomplete';
import { foodItems } from '../utils/FoodData';
import { liquorItems } from '../utils/LiquorData';
import { formatCurrency } from '../utils/formatters';

export default function BillEditor({
  items,
  billNo,
  onNextBill,
  onAddItem,
  onAddNamedItem,
  onUpdateItem,
  onDeleteItem,
  onClearAll,
  summary,
}) {
  const foodItems_bill = items.filter((item) => (item.category || 'FOOD').toUpperCase() === 'FOOD');
  const liquorItems_bill = items.filter((item) => (item.category || 'FOOD').toUpperCase() === 'LIQUOR');
  const otherItems = items.filter((item) => {
    const cat = (item.category || 'FOOD').toUpperCase();
    return cat !== 'FOOD' && cat !== 'LIQUOR';
  });

  const renderItemTable = (sectionItems, defaultCategory) => (
    <div className="table-responsive">
      <table className="bill-table">
        <thead>
          <tr>
            <th className="col-food-item">Description</th>
            <th className="col-category">Category</th>
            <th className="col-quantity">Qty</th>
            <th className="col-unit-price">Rate</th>
            <th className="col-row-total">Amount</th>
            <th className="col-action">Action</th>
          </tr>
        </thead>
        <tbody>
          {sectionItems.map((item, index) => (
            <BillItemRow
              key={item.id}
              item={item}
              index={index}
              onUpdateItem={onUpdateItem}
              onDeleteItem={onDeleteItem}
              onEnterOnLastRow={(category) => onAddItem(category || defaultCategory)}
              isLastRow={index === sectionItems.length - 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className="bill-editor-section no-print">
      <div className="card editor-card">
        <div className="card-header">
          <div className="card-title-group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <h2>Items & Tax Editor</h2>
            <span className="bill-no-badge" title="Dynamic Bill Number">BILL #{billNo}</span>
          </div>

          <div className="editor-quick-tools">
            <button
              type="button"
              className="btn btn-outline-sm"
              onClick={onNextBill}
              title="Increment Bill Number and start a new order"
            >
              Next Bill
            </button>

            {items.length > 0 && (
              <button
                type="button"
                className="btn btn-outline-danger-sm"
                onClick={onClearAll}
                title="Clear all rows"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Clear All
              </button>
            )}
          </div>
        </div>


        <div className="card-body editor-sections-container">
          {/* FOOD SECTION */}
          <div className="editor-category-section food-section shadow-sm">
            <div className="section-header">
              <div className="section-title-group">

                <div>
                  <h3 className="section-title">Food Items</h3>
                  <span className="tax-badge food-tax-badge">5% GST (2.5% CGST + 2.5% SGST)</span>
                </div>
              </div>
              <div className="section-meta">
                <span className="section-count-badge">{foodItems_bill.length} {foodItems_bill.length === 1 ? 'item' : 'items'}</span>
                <span className="section-subtotal">Subtotal: <strong>{formatCurrency(summary.foodSubTotal)}</strong></span>
              </div>
            </div>

            {/* Food autocomplete search bar */}
            <div className="section-autocomplete-bar">
              <ItemAutocomplete
                items={foodItems}
                category="FOOD"
                onAddItem={onAddNamedItem}
                placeholder="Search food item (e.g. CHICKEN 65)…"
                accentColor="#10b981"
              />
            </div>

            {foodItems_bill.length === 0 ? (
              <div className="section-empty-state">
                <p>No food items added yet. Search above or click below.</p>
                <button
                  type="button"
                  className="btn btn-outline-food-sm"
                  onClick={() => onAddItem('FOOD')}
                >
                  + Add Blank Food Row
                </button>
              </div>
            ) : (
              <>
                {renderItemTable(foodItems_bill, 'FOOD')}
                <div className="section-footer-actions">
                  <button
                    type="button"
                    className="btn btn-food-add"
                    onClick={() => onAddItem('FOOD')}
                  >
                    + Add Blank Row
                  </button>
                </div>
              </>
            )}
          </div>

          {/* LIQUOR SECTION */}
          <div className="editor-category-section liquor-section shadow-sm">
            <div className="section-header">
              <div className="section-title-group">

                <div>
                  <h3 className="section-title">Liquor Items</h3>
                  <span className="tax-badge liquor-tax-badge">10% VAT</span>
                </div>
              </div>
              <div className="section-meta">
                <span className="section-count-badge">{liquorItems_bill.length} {liquorItems_bill.length === 1 ? 'item' : 'items'}</span>
                <span className="section-subtotal">Subtotal: <strong>{formatCurrency(summary.liquorSubTotal)}</strong></span>
              </div>
            </div>

            {/* Liquor autocomplete search bar */}
            <div className="section-autocomplete-bar">
              <ItemAutocomplete
                items={liquorItems}
                category="LIQUOR"
                onAddItem={onAddNamedItem}
                placeholder="Search liquor item (e.g. BLACK DOG)…"
                accentColor="#f59e0b"
              />
            </div>

            {liquorItems_bill.length === 0 ? (
              <div className="section-empty-state">
                <p>No liquor items added yet. Search above or click below.</p>
                <button
                  type="button"
                  className="btn btn-outline-liquor-sm"
                  onClick={() => onAddItem('LIQUOR')}
                >
                  + Add Blank Liquor Row
                </button>
              </div>
            ) : (
              <>
                {renderItemTable(liquorItems_bill, 'LIQUOR')}
                <div className="section-footer-actions">
                  <button
                    type="button"
                    className="btn btn-liquor-add"
                    onClick={() => onAddItem('LIQUOR')}
                  >
                    + Add Blank Row
                  </button>
                </div>
              </>
            )}
          </div>

          {/* OTHER SECTION (if any custom category exists) */}
          {otherItems.length > 0 && (
            <div className="editor-category-section other-section shadow-sm">
              <div className="section-header">
                <div className="section-title-group">
                  <span className="section-icon">📦</span>
                  <div>
                    <h3 className="section-title">Other Items</h3>
                  </div>
                </div>
                <div className="section-meta">
                  <span className="section-subtotal">Subtotal: <strong>{formatCurrency(summary.otherSubTotal)}</strong></span>
                </div>
              </div>
              {renderItemTable(otherItems, 'OTHER')}
            </div>
          )}

          {/* GRAND TOTAL BANNER & CONTROLS */}
          <div className="editor-footer-controls">
            <div className="add-quick-buttons">
              <button
                type="button"
                className="btn btn-food-add"
                onClick={() => onAddItem('FOOD')}
              >
                + Add Food
              </button>
              <button
                type="button"
                className="btn btn-liquor-add"
                onClick={() => onAddItem('LIQUOR')}
              >
                + Add Liquor
              </button>
            </div>

            <div className="grand-total-banner">
              <div className="subtotal-mini-pills">
                <span>Food Sub: {formatCurrency(summary.foodSubTotal)}</span>
                <span>Liquor Sub: {formatCurrency(summary.liquorSubTotal)}</span>
              </div>
              <div className="total-display-group">
                <span className="grand-total-label">TOTAL:</span>
                <span className="grand-total-amount">
                  {formatCurrency(summary.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

