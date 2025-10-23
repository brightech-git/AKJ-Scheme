import React from 'react';
import { Platform } from 'react-native';

export const generateReceiptHTML = (paymentInfo, formatDate, formatAmount, formatWeight, formatGoldRate) => {
  const formattedDate = formatDate(paymentInfo.timestamp);
  const formattedAmount = formatAmount(paymentInfo.amount);
  const formattedWeight = formatWeight(paymentInfo.weight);
  const formattedGoldRate = formatGoldRate(paymentInfo.goldRate);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AKJ Payment Receipt - ${paymentInfo.orderId}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .receipt-container {
            max-width: 400px;
            width: 100%;
            background: white;
            border-radius: 16px;
            box-shadow: 
                0 20px 60px rgba(0, 0, 0, 0.1),
                0 8px 32px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            position: relative;
        }
        
        .receipt-header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: white;
            padding: 30px 25px 20px;
            text-align: center;
            position: relative;
        }
        
        .success-badge {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
        }
        
        .success-badge svg {
            width: 30px;
            height: 30px;
            fill: white;
        }
        
        .company-name {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 5px;
            background: linear-gradient(135deg, #fbbf24, #d97706);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .receipt-title {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 5px;
        }
        
        .receipt-subtitle {
            font-size: 14px;
            opacity: 0.8;
            margin-bottom: 15px;
        }
        
        .amount-display {
            font-size: 32px;
            font-weight: 700;
            color: #10b981;
            margin: 15px 0;
            text-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
        }
        
        .receipt-body {
            padding: 25px;
        }
        
        .section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .section-title::before {
            content: '';
            width: 4px;
            height: 16px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            border-radius: 2px;
        }
        
        .info-grid {
            display: grid;
            gap: 12px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .info-label {
            color: #6b7280;
            font-weight: 500;
            font-size: 13px;
        }
        
        .info-value {
            color: #1f2937;
            font-weight: 600;
            text-align: right;
            font-size: 13px;
        }
        
        .gold-highlight {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            padding: 12px;
            border-radius: 12px;
            border: 1px solid #fcd34d;
            margin: 15px 0;
        }
        
        .gold-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 13px;
        }
        
        .gold-item:last-child {
            margin-bottom: 0;
        }
        
        .gold-label {
            color: #92400e;
            font-weight: 500;
        }
        
        .gold-value {
            color: #92400e;
            font-weight: 700;
        }
        
        .status-badge {
            background: #10b981;
            color: white;
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 11px;
            font-weight: 600;
            display: inline-block;
        }
        
        .security-footer {
            background: #f8fafc;
            padding: 20px 25px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .security-text {
            color: #6b7280;
            font-size: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-bottom: 6px;
        }
        
        .transaction-id {
            font-family: 'Courier New', monospace;
            background: #1f2937;
            color: #10b981;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 10px;
            margin-top: 6px;
            display: inline-block;
        }
        
        .watermark {
            position: absolute;
            bottom: 15px;
            right: 15px;
            opacity: 0.1;
            font-size: 36px;
            font-weight: 900;
            color: #1f2937;
            transform: rotate(-15deg);
        }
        
        .receipt-number {
            position: absolute;
            top: 15px;
            left: 15px;
            background: rgba(255, 255, 255, 0.1);
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 10px;
            color: white;
        }
        
        .akj-logo {
            font-size: 12px;
            opacity: 0.9;
            margin-top: 5px;
        }
        
        @media print {
            body {
                background: white !important;
                padding: 0;
            }
            .receipt-container {
                box-shadow: none;
                border-radius: 0;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="watermark">AKJ</div>
        <div class="receipt-number">Receipt: ${paymentInfo.orderId}</div>
        
        <div class="receipt-header">
            <div class="success-badge">
                <svg viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
            </div>
            <div class="company-name">AKJ MINI GOLD SOUK</div>
            <div class="akj-logo">Payment Receipt</div>
            <h1 class="receipt-title">Payment Successful</h1>
            <p class="receipt-subtitle">Your gold purchase has been confirmed</p>
            <div class="amount-display">₹${formattedAmount}</div>
        </div>
        
        <div class="receipt-body">
            <div class="section">
                <h2 class="section-title">Transaction Details</h2>
                <div class="info-grid">
                    <div class="info-row">
                        <span class="info-label">Receipt No</span>
                        <span class="info-value">${paymentInfo.orderId}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Date & Time</span>
                        <span class="info-value">${formattedDate}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Payment ID</span>
                        <span class="info-value">${paymentInfo.razorpayPaymentId}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Status</span>
                        <span class="status-badge">Completed</span>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">Gold Allocation</h2>
                <div class="gold-highlight">
                    <div class="gold-item">
                        <span class="gold-label">Amount Paid</span>
                        <span class="gold-value">₹${formattedAmount}</span>
                    </div>
                    <div class="gold-item">
                        <span class="gold-label">Gold Weight</span>
                        <span class="gold-value">${formattedWeight} grams</span>
                    </div>
                    <div class="gold-item">
                        <span class="gold-label">Gold Rate</span>
                        <span class="gold-value">₹${formattedGoldRate}/gm</span>
                    </div>
                    ${paymentInfo.isDreamGoldPlan ? `
                    <div class="gold-item">
                        <span class="gold-label">Plan Type</span>
                        <span class="gold-value">Dream Gold Plan ✨</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">Customer Information</h2>
                <div class="info-grid">
                    <div class="info-row">
                        <span class="info-label">Customer Name</span>
                        <span class="info-value">${paymentInfo.userName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Phone Number</span>
                        <span class="info-value">${paymentInfo.phoneNumber}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="security-footer">
            <div class="security-text">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                Secured with 256-bit SSL encryption
            </div>
            <div class="transaction-id">AKJ Receipt: ${paymentInfo.orderId}</div>
        </div>
    </div>
</body>
</html>
    `;
};

// Utility function to format currency with Indian numbering system
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Utility function to format date in a consistent way
export const formatReceiptDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Function to generate PDF filename with receipt number
export const generateReceiptFileName = (paymentInfo) => {
  return `AKJ_Receipt_${paymentInfo.orderId}.pdf`;
};