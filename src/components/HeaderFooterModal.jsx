import React, { useState, useEffect } from 'react';

export default function HeaderFooterModal({ isOpen, onClose, receiptInfo, onSave }) {
  const [formData, setFormData] = useState(receiptInfo);

  useEffect(() => {
    if (isOpen) {
      setFormData(receiptInfo);
    }
  }, [isOpen, receiptInfo]);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop no-print" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <h3>Edit Receipt Details</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="hotel-name-input">Hotel / Restaurant Name</label>
              <input
                id="hotel-name-input"
                type="text"
                className="form-control"
                value={formData.hotelName || ''}
                onChange={(e) => handleChange('hotelName', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address-input">Address (Multi-line)</label>
              <textarea
                id="address-input"
                className="form-control textarea-control"
                rows="3"
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="billno-input">Bill No.</label>
              <input
                id="billno-input"
                type="text"
                className="form-control"
                value={formData.billNo || ''}
                onChange={(e) => handleChange('billNo', e.target.value)}
              />
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="cust-input">Customer</label>
                <input
                  id="cust-input"
                  type="text"
                  className="form-control"
                  value={formData.custName || ''}
                  onChange={(e) => handleChange('custName', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="paidby-input">Paid By</label>
                <input
                  id="paidby-input"
                  type="text"
                  className="form-control"
                  value={formData.paidBy || ''}
                  onChange={(e) => handleChange('paidBy', e.target.value)}
                />
              </div>
            </div>

            <div className="dynamic-info-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span><strong>Dynamic Date & Time:</strong> Automatically generated in real-time on every receipt. No manual entry needed.</span>
            </div>


            <div className="form-group">
              <label htmlFor="footer-msg-input">Thank-You Message (Footer)</label>
              <textarea
                id="footer-msg-input"
                className="form-control textarea-control"
                rows="2"
                value={formData.footerMessage || ''}
                onChange={(e) => handleChange('footerMessage', e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

