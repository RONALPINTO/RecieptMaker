/**
 * Formats a number as Indian Rupee currency (₹)
 * Examples: 250 -> ₹ 250, 125.5 -> ₹ 125.50, 8.25 -> ₹ 8.25
 */
export function formatCurrency(amount, showSymbol = true) {
  const num = Number(amount) || 0;
  const isInteger = Number.isInteger(num);
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return showSymbol ? `₹ ${formatted}` : formatted;
}

/**
 * Cleanly formats quantity values
 */
export function formatQuantity(qty) {
  const num = Number(qty) || 0;
  return parseFloat(num.toFixed(3)).toString();
}

/**
 * Calculates total for an item row
 */
export function calculateRowTotal(quantity, unitPrice) {
  const qty = parseFloat(quantity) || 0;
  const price = parseFloat(unitPrice) || 0;
  return parseFloat((qty * price).toFixed(2));
}

/**
 * Returns current formatted date string (e.g. "13 AUG 2026")
 */
export function getCurrentFormattedDate() {
  const now = new Date();
  const day = now.toLocaleDateString('en-IN', { day: '2-digit' });
  const month = now.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Returns current formatted time string (e.g. "04:15" or "16:15")
 */
export function getCurrentFormattedTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Generates a dynamic bill number (e.g., sequential or based on current timestamp)
 */
export function generateDynamicBillNo(currentNo) {
  if (currentNo && !isNaN(Number(currentNo))) {
    return (Number(currentNo) + 1).toString();
  }
  // Fallback 4-digit number
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * Full Receipt Totals & Tax Calculations
 */
export function calculateReceiptSummary(items = []) {
  let foodSubTotal = 0;
  let liquorSubTotal = 0;
  let otherSubTotal = 0;

  items.forEach((item) => {
    const rowTotal = calculateRowTotal(item.quantity, item.unitPrice);
    const cat = (item.category || 'FOOD').toUpperCase();
    if (cat === 'FOOD') {
      foodSubTotal += rowTotal;
    } else if (cat === 'LIQUOR') {
      liquorSubTotal += rowTotal;
    } else {
      otherSubTotal += rowTotal;
    }
  });

  const subTotal = foodSubTotal + liquorSubTotal + otherSubTotal;
  const cgst = parseFloat((foodSubTotal * 0.025).toFixed(2));
  const sgst = parseFloat((foodSubTotal * 0.025).toFixed(2));
  const vat = parseFloat((liquorSubTotal * 0.10).toFixed(2));
  const totalGst = parseFloat((cgst + sgst).toFixed(2));
  const totalVat = vat;
  const nonTaxable = 0;
  
  const rawTotal = subTotal + cgst + sgst + vat;
  const grandTotal = parseFloat(rawTotal.toFixed(2));

  return {
    foodSubTotal,
    liquorSubTotal,
    otherSubTotal,
    subTotal,
    cgst,
    sgst,
    vat,
    totalGst,
    totalVat,
    nonTaxable,
    grandTotal,
  };
}

export function calculateGrandTotal(items) {
  return calculateReceiptSummary(items).grandTotal;
}


