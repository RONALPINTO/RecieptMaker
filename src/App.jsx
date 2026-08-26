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
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billType, setBillType] = useState('AC');

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

  // Add a new named item row (used by ItemAutocomplete — name and price pre-filled)
  const handleAddNamedItem = (name, category = 'FOOD', price = '') => {
    const newItem = {
      id: Date.now().toString() + Math.random().toString().slice(2, 6),
      name: name,
      category: category,
      quantity: 1,
      unitPrice: price !== undefined && price !== null ? price : '',
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

      {/* Main Split Layout: Editor on Left, 80mm Thermal Receipt Live Preview on Right (Screen view only) */}
      <main className="main-layout no-print">
        <BillEditor
          items={items}
          billNo={billNo}
          tableNo={receiptInfo.tableNo}
          billType={billType}
          onBillTypeChange={setBillType}
          onNextBill={handleNextBill}
          onTableNoChange={(val) => setReceiptInfo((prev) => ({ ...prev, tableNo: val }))}
          onAddItem={handleAddItem}
          onAddNamedItem={handleAddNamedItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onClearAll={handleClearAll}
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

      {/* Standalone Print-Only Receipt Output (Matches Client Reference Architecture) */}
      <div className="print-only-receipt">
        <ReceiptPreview
          receiptInfo={receiptInfo}
          billNo={billNo}
          dateStr={currentDate}
          timeStr={currentTime}
          items={items}
          summary={summary}
          onPrint={handlePrint}
        />
      </div>

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


