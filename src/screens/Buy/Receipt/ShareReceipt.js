import { Platform } from 'react-native';

export const generateShareMessage = (paymentInfo, formatDate, formatAmount, formatWeight, formatGoldRate) => {
  const formattedDate = formatDate(paymentInfo.timestamp);
  const formattedAmount = formatAmount(paymentInfo.amount);
  const formattedWeight = formatWeight(paymentInfo.weight);
  const formattedGoldRate = formatGoldRate(paymentInfo.goldRate);
  
  const planType = paymentInfo.isDreamGoldPlan ? '✨ Dream Gold Plan' : 'Standard Plan';
  
  // Create a beautiful text receipt for sharing
  const shareMessage = `
🏦 *AKJ MINI GOLD SOUK - PAYMENT RECEIPT* 🏦

🎉 *Payment Successful!*

💳 *Transaction Details:*
────────────────────
📋 Order ID: ${paymentInfo.orderId}
📅 Date & Time: ${formattedDate}
💰 Amount: ₹${formattedAmount}
🆔 Payment ID: ${paymentInfo.razorpayPaymentId}
✅ Status: ✅ Completed

🌟 *Gold Allocation:*
────────────────────
⚖️ Gold Weight: ${formattedWeight} grams
💎 Gold Rate: ₹${formattedGoldRate}/gm
📊 Plan Type: ${planType}

👤 *Customer Information:*
────────────────────
🤵 Customer: ${paymentInfo.userName}
📞 Phone: ${paymentInfo.phoneNumber}

🔒 *Security:*
────────────────────
This transaction is secured with 256-bit SSL encryption and processed through Razorpay's secure payment gateway.

💫 *Thank you for choosing AKJ Mini Gold Souk!*
Your gold is securely stored in our digital vault.

📱 Download our app: https://play.google.com/store/apps/details?id=com.akjgold.akj
🌐 Visit: www.akjminigoldsouk.com

_This is an automated receipt. Please keep this for your records._
    `.trim();

  return shareMessage;
};

// Alternative formatted message for different platforms
export const generateSMSMessage = (paymentInfo, formatDate, formatAmount, formatWeight, formatGoldRate) => {
  const formattedDate = formatDate(paymentInfo.timestamp);
  const formattedAmount = formatAmount(paymentInfo.amount);
  
  return `
AKJ Mini Gold Souk - Payment Receipt

Payment Successful!
Order: ${paymentInfo.orderId}
Amount: ₹${formattedAmount}
Date: ${formattedDate}
Status: Completed

Thank you for your gold purchase!
Download app: https://play.google.com/store/apps/details?id=com.akjgold.akj
  `.trim();
};

// WhatsApp-specific formatting
export const generateWhatsAppMessage = (paymentInfo, formatDate, formatAmount, formatWeight, formatGoldRate) => {
  const formattedDate = formatDate(paymentInfo.timestamp);
  const formattedAmount = formatAmount(paymentInfo.amount);
  const formattedWeight = formatWeight(paymentInfo.weight);
  
  return `
*AKJ Mini Gold Souk - Gold Purchase Receipt* 🏦

*Payment Successful!* ✅

*Order Details:*
• Order ID: ${paymentInfo.orderId}
• Date: ${formattedDate}
• Amount: ₹${formattedAmount}
• Gold Weight: ${formattedWeight}g
• Payment ID: ${paymentInfo.razorpayPaymentId}

*Customer:* ${paymentInfo.userName}

Your gold is securely allocated! 🌟

Download our app: https://play.google.com/store/apps/details?id=com.akjgold.akj
  `.trim();
};

// Email subject and body
export const generateEmailContent = (paymentInfo, formatDate, formatAmount, formatWeight, formatGoldRate) => {
  const formattedDate = formatDate(paymentInfo.timestamp);
  const formattedAmount = formatAmount(paymentInfo.amount);
  const formattedWeight = formatWeight(paymentInfo.weight);
  const formattedGoldRate = formatGoldRate(paymentInfo.goldRate);
  
  return {
    subject: `Payment Receipt - Order ${paymentInfo.orderId} - AKJ Mini Gold Souk`,
    body: `
Dear ${paymentInfo.userName},

Thank you for your gold purchase with AKJ Mini Gold Souk! 

PAYMENT RECEIPT
───────────────────────────────
ORDER ID: ${paymentInfo.orderId}
DATE: ${formattedDate}
AMOUNT: ₹${formattedAmount}
PAYMENT ID: ${paymentInfo.razorpayPaymentId}
STATUS: Completed

GOLD ALLOCATION
───────────────────────────────
GOLD WEIGHT: ${formattedWeight} grams
GOLD RATE: ₹${formattedGoldRate}/gram
PLAN TYPE: ${paymentInfo.isDreamGoldPlan ? 'Dream Gold Plan' : 'Standard Plan'}

CUSTOMER DETAILS
───────────────────────────────
NAME: ${paymentInfo.userName}
PHONE: ${paymentInfo.phoneNumber}

Your gold has been securely allocated to your digital vault and is now part of your portfolio. You can view your holdings anytime in the "My Gold" section of our app.

Download our Android app: https://play.google.com/store/apps/details?id=com.akjgold.akj

For any queries, please contact our support team.

Thank you for choosing AKJ Mini Gold Souk!

Warm regards,
AKJ Mini Gold Souk Team
www.akjminigoldsouk.com

🔒 This transaction was secured with 256-bit SSL encryption.
    `.trim()
  };
};

// Social media post version
export const generateSocialMediaMessage = (paymentInfo, formatAmount) => {
  const formattedAmount = formatAmount(paymentInfo.amount);
  
  return `
Just purchased digital gold worth ₹${formattedAmount} with AKJ Mini Gold Souk! 🎉

✅ Secure & transparent
✅ Instant allocation
✅ 24/7 access to my gold portfolio

Download the app: https://play.google.com/store/apps/details?id=com.akjgold.akj

#AKJMiniGoldSouk #DigitalGold #GoldInvestment #SmartSaving #${formattedAmount}Gold
  `.trim();
};

// Utility function to format IDs for better readability
export const formatIdForDisplay = (id, visibleChars = 6) => {
  if (!id || id === 'N/A') return 'N/A';
  if (id.length <= visibleChars * 2) return id;
  
  return `${id.substring(0, visibleChars)}...${id.substring(id.length - visibleChars)}`;
};

// Platform-specific message generator
export const getPlatformSpecificMessage = (paymentInfo, formatDate, formatAmount, formatWeight, formatGoldRate, platform) => {
  switch (platform) {
    case 'whatsapp':
      return generateWhatsAppMessage(paymentInfo, formatDate, formatAmount, formatWeight, formatGoldRate);
    case 'sms':
      return generateSMSMessage(paymentInfo, formatDate, formatAmount, formatWeight, formatGoldRate);
    case 'email':
      return generateEmailContent(paymentInfo, formatDate, formatAmount, formatWeight, formatGoldRate);
    case 'social':
      return generateSocialMediaMessage(paymentInfo, formatAmount);
    default:
      return generateShareMessage(paymentInfo, formatDate, formatAmount, formatWeight, formatGoldRate);
  }
};