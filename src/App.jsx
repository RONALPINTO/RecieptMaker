import React, { useState, useEffect } from 'react';
import HeaderControls from './components/HeaderControls';
import BillEditor from './components/BillEditor';
import ReceiptPreview from './components/ReceiptPreview';
import HeaderFooterModal from './components/HeaderFooterModal';
import {
  formatCurrency,
  calculateReceiptSummary,
  getCurrentFormattedDate,
  getCurrentFormattedTime,
  generateDynamicBillNo,
} from './utils/formatters';

const DEFAULT_SAMPLE_ITEMS = [
  { id: '1', name: 'channa chat', category: 'FOOD', quantity: 1, unitPrice: 30 },
  { id: '2', name: 'fried rice', category: 'FOOD', quantity: 1, unitPrice: 300 },
  { id: '3', name: 'godfather beer offer', category: 'LIQUOR', quantity: 1, unitPrice: 999 },
];

const DEFAULT_RECEIPT_INFO = {
  hotelName: 'YES BAITHAK',
  address: 'SHOP NO 17, SARVODYA COMPLEX, SHREE\nGANESH BUILDING, GEETA NAGAR, MIRA ROAD\nEAST, MIRA BHAYANDAR, MAHARASHTRA 401107',
  tableNo: '21',
  custName: 'P',
  paidBy: 'CASH',
  footerMessage: 'THANKS FOR YOUR VISIT! HAPPY JOURNEY',
};

export default function App() {
  const [receiptInfo, setReceiptInfo] = useState(DEFAULT_RECEIPT_INFO);
  const [billNo, setBillNo] = useState('3249');
  const [items, setItems] = useState(DEFAULT_SAMPLE_ITEMS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Live dynamic date & time state
  const [currentDate, setCurrentDate] = useState(getCurrentFormattedDate());
  const [currentTime, setCurrentTime] = useState(getCurrentFormattedTime());

  // Update date and time dynamically every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(getCurrentFormattedDate());
      setCurrentTime(getCurrentFormattedTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut: Ctrl + P or Cmd + P opens print dialog
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Add new item row (default FOOD category or specified category)
  const handleAddItem = (category = 'FOOD') => {
    const newItem = {
      id: Date.now().toString() + Math.random().toString().slice(2, 6),
      name: '',
      category: category,
      quantity: 1,
      unitPrice: '',
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Update specific item properties
  const handleUpdateItem = (id, fieldsToUpdate) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...fieldsToUpdate } : item))
    );
  };

  // Delete an item row
  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all item rows and auto-increment dynamic bill number for next customer
  const handleClearAll = () => {
    setItems([]);
  };

  // Generate next dynamic Bill No
  const handleNextBill = () => {
    setBillNo((prev) => generateDynamicBillNo(prev));
    setItems([]);
  };

  // Reset / Load YES BAITHAK Sample Data
  const handleLoadSampleData = () => {
    setReceiptInfo(DEFAULT_RECEIPT_INFO);
    setBillNo('3249');
    setItems(DEFAULT_SAMPLE_ITEMS);
  };

  // Save Header & Details configuration from Modal
  const handleSaveHeaderFooter = (updatedFields) => {
    if (updatedFields.billNo) {
      setBillNo(updatedFields.billNo);
    }
    setReceiptInfo((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  // Trigger browser native print
  const handlePrint = () => {
    // Refresh date/time at moment of printing
    setCurrentDate(getCurrentFormattedDate());
    setCurrentTime(getCurrentFormattedTime());
    window.print();
  };

  const summary = calculateReceiptSummary(items);

  return (
    <div className="app-container">
      {/* App Header & Top Controls */}
      <HeaderControls
        hotelName={receiptInfo.hotelName}
        onEditHeaderFooter={() => setIsModalOpen(true)}
        onPrint={handlePrint}
        onItemCount={items.length}
        grandTotalFormatted={formatCurrency(summary.grandTotal)}
      />

      {/* Main Split Layout: Editor on Left, 80mm Thermal Receipt Live Preview on Right */}
      <main className="main-layout">
        <BillEditor
          items={items}
          billNo={billNo}
          onNextBill={handleNextBill}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onClearAll={handleClearAll}
          onLoadSampleData={handleLoadSampleData}
          summary={summary}
        />

        <ReceiptPreview
          receiptInfo={receiptInfo}
          billNo={billNo}
          dateStr={currentDate}
          timeStr={currentTime}
          items={items}
          summary={summary}
          onPrint={handlePrint}
        />
      </main>

      {/* Edit Header, Address & Bill Details Modal */}
      <HeaderFooterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        receiptInfo={{ ...receiptInfo, billNo }}
        onSave={handleSaveHeaderFooter}
      />
    </div>
  );
}


