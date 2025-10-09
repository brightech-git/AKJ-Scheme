// PaymentDetailScreen.js - Enhanced version
import React, { useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
  ImageBackground,
} from "react-native";
import {
  COLORS,
  SIZES,
  FONTS,
  moderateScale,
  verticalScale,
} from "../../utils/Theme";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const PaymentDetailScreen = ({ navigation, route }) => {
  const { payment, accountDetails, schemeName, productdata } = route.params;

  if (!payment) {
    navigation.goBack();
    return null;
  }

  const paymentHistory = accountDetails?.paymentHistoryList || [];

  const formatDateTimeWithTime = useCallback((dateTimeString) => {
    if (!dateTimeString) return "N/A";
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  }, []);

  const customerName = accountDetails?.personalInfo?.pName || "Customer Name";
  const schemeDetails = accountDetails?.schemeSummary || {};
  const personalId = accountDetails?.personalInfo?.personalId || "N/A";
  const totalSchemeAmount =
    schemeDetails.schemaSummaryTransBalance?.amtrecd ||
    paymentHistory.reduce((total, p) => total + parseFloat(p.amount || 0), 0);
  const amountReceived = accountDetails.amount;
  const insPaid =
    schemeDetails.schemaSummaryTransBalance?.insPaid || paymentHistory.length;
  const totalIns = schemeDetails.instalment || "11";
  const groupCode = productdata?.groupcode || "N/A";

  const getAmountInWords = (amount) => {
    const num = parseInt(amount);
    if (num === 500) return "Rupees Five Hundred Only";
    return `Rupees ${num.toLocaleString("en-IN").replace(/,/g, " ")} Only`;
  };

  const generateReceiptHTML = (payment) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .receipt-container { max-width: 400px; margin: 0 auto; border: 2px solid #000; padding: 20px; background-color: #fff; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .company-name { font-size: 22px; font-weight: bold; margin-bottom: 5px; color: #2c5aa0; }
          .address { font-size: 14px; margin-bottom: 10px; }
          .receipt-title { font-size: 18px; font-weight: bold; margin-bottom: 20px; text-align: center; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed #ccc; }
          .detail-label { font-weight: bold; flex: 1; }
          .detail-value { flex: 1; text-align: right; }
          .amount-section { background-color: #f5f5f5; padding: 12px; margin: 16px 0; border-radius: 6px; text-align: center; }
          .amount { font-size: 20px; font-weight: bold; color: #2c5aa0; }
          .footer { text-align: center; margin-top: 20px; padding-top: 10px; border-top: 2px solid #000; font-style: italic; }
          .timestamp { font-size: 12px; color: #666; text-align: center; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="company-name">BMG JEWELLERS PVT LTD</div>
            <div class="address">Madurai-625001</div>
          </div>
          <div class="receipt-title">INSTALLMENT RECEIPT - CUSTOMER COPY</div>
          <div class="timestamp">Generated on: ${formattedDate} at ${formattedTime}</div>
          <div class="detail-row"><span class="detail-label">DATE:</span><span class="detail-value">${formatDate(
            payment.updateTime
          )}</span></div>
          <div class="detail-row"><span class="detail-label">TIME:</span><span class="detail-value">${
            formatDateTimeWithTime(payment.updateTime).split(",")[1]?.trim() ||
            "19:33:00"
          }</span></div>
          <div class="detail-row"><span class="detail-label">REC NO:</span><span class="detail-value">${
            payment.receiptNo || "N/A"
          }</span></div>
          <div class="detail-row"><span class="detail-label">NAME:</span><span class="detail-value">${customerName}</span></div>
          <div class="detail-row"><span class="detail-label">PERSONAL ID:</span><span class="detail-value">${personalId}</span></div>
          <div class="detail-row"><span class="detail-label">SCHEME:</span><span class="detail-value">${
            schemeDetails.schemeName?.trim() || schemeName || "DREAM GOLD PLAN"
          }</span></div>
          <div class="detail-row"><span class="detail-label">INSTALLMENT NO:</span><span class="detail-value">${
            payment.installment || "N/A"
          }</span></div>
          <div class="amount-section">
            <div>INSTALLMENT AMOUNT</div>
            <div class="amount">RS.${parseFloat(
              payment.amount || amountReceived
            ).toLocaleString("en-IN")}/-</div>
            <div>(${getAmountInWords(payment.amount || amountReceived)})</div>
          </div>
          <div class="detail-row"><span class="detail-label">TOTAL SCHEME AMOUNT:</span><span class="detail-value">RS.${parseFloat(
            totalSchemeAmount
          ).toLocaleString("en-IN")}/-</span></div>
          <div class="detail-row"><span class="detail-label">AMOUNT RECEIVED:</span><span class="detail-value">RS.${parseFloat(
            amountReceived
          ).toLocaleString("en-IN")}/-</span></div>
          <div class="detail-row"><span class="detail-label">INSTALLMENTS PAID:</span><span class="detail-value">${insPaid}/${totalIns}</span></div>
          <div class="footer">For BMG JEWELLERS PVT LTD</div>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrintReceipt = async (payment) => {
    try {
      const html = generateReceiptHTML(payment);
      const { uri } = await Print.printToFileAsync({ html });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Share Receipt",
        });
      } else {
        Alert.alert("Success", "Receipt generated successfully!");
      }
    } catch (error) {
      console.error("Error printing receipt:", error);
      Alert.alert("Error", "Failed to generate receipt");
    }
  };

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/bg6.jpg")}
      style={styles.mainBackground}
      imageStyle={styles.backgroundImageStyle}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.primary} />
        <CommonHeader
          title="Payment Details"
          showBack
          backIconName="arrow-back"
          backIconColor={COLORS.white}
          backgroundColor="transparent"
          textColor={COLORS.white}
          transparent
          centerTitle
          rightComponent={
            <TouchableOpacity
              onPress={() => handlePrintReceipt(payment)}
              style={styles.actionButton}
            >
              <MaterialIcons name="print" size={22} color={COLORS.black} />
            </TouchableOpacity>
          }
        />
        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.receiptContainer}>
            <View style={styles.receiptHeader}>
              <Text style={styles.companyName}>BMG JEWELLERS PVT LTD</Text>
              <Text style={styles.companyAddress}>Madurai-625001</Text>
            </View>
            <Text style={styles.receiptTitle}>Customer Payment Copy</Text>
            <View style={styles.detailsGrid}>
              <DetailRow label="NAME" value={customerName} />
              <DetailRow
                label="SCHEME"
                value={
                  schemeDetails.schemeName?.trim() ||
                  schemeName ||
                  "DREAM GOLD PLAN"
                }
              />
              <DetailRow label="GROUP CODE" value={groupCode} />
              <DetailRow label="DATE" value={formatDate(payment.updateTime)} />
              <DetailRow
                label="TIME"
                value={
                  formatDateTimeWithTime(payment.updateTime)
                    .split(",")[1]
                    ?.trim() || "19:33:00"
                }
              />
              <DetailRow
                label="RECEIPT NO"
                value={payment.receiptNo || "N/A"}
              />
              <DetailRow
                label="INSTALLMENT NO"
                value={payment.installment || "N/A"}
              />
            </View>
            <DetailRow
              label="TOTAL AMOUNT"
              value={`RS.${parseFloat(totalSchemeAmount).toLocaleString(
                "en-IN"
              )} /-`}
            />
            <DetailRow
              label="AMOUNT RECEIVED"
              value={`RS.${parseFloat(amountReceived).toLocaleString(
                "en-IN"
              )} /-`}
            />
            <DetailRow
              label="INSTALLMENTS PAID"
              value={`${insPaid}/${totalIns}`}
            />
            <View style={styles.footer}>
              <Text style={styles.footerText}>For BMG JEWELLERS PVT LTD</Text>
            </View>
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.printButton}
              onPress={() => handlePrintReceipt(payment)}
            >
              <MaterialIcons name="print" size={20} color={COLORS.white} />
              <Text style={styles.printButtonText}>Print Receipt</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  mainBackground: { flex: 1 },
  safeArea: { flex: 1 },
  actionButton: { padding: moderateScale(8) },
  modalContent: { flex: 1, padding: moderateScale(12) },
  receiptContainer: {
    backgroundColor: COLORS.card1,
    borderRadius: SIZES.radius_lg,
    padding: moderateScale(16),
    marginBottom: moderateScale(16),
  },
  receiptHeader: {
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.black,
    paddingBottom: moderateScale(8),
    marginBottom: moderateScale(16),
  },
  companyName: {
    ...FONTS.heading,
    fontSize: SIZES.h5,
    lineHeight: moderateScale(24),
    textAlign: "center",
    marginBottom: moderateScale(2),
    color: COLORS.primary,
  },
  companyAddress: {
    ...FONTS.body1,
    textAlign: "center",
    color: COLORS.textLight,
    fontSize: SIZES.fontSm,
  },
  receiptTitle: {
    ...FONTS.body1,
    fontSize: SIZES.h6,
    textAlign: "center",
    marginBottom: moderateScale(16),
    color: COLORS.primary,
    fontWeight: "600",
  },
  detailsGrid: { gap: moderateScale(4), marginBottom: moderateScale(12) },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: moderateScale(4),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    borderStyle: "dashed",
    minHeight: moderateScale(24),
  },
  detailLabel: {
    ...FONTS.subheading,
    fontSize: SIZES.h6 - 2,
    color: COLORS.text,
    flex: 1,
    textAlign: "left",
  },
  detailValue: {
    ...FONTS.body1,
    color: COLORS.text,
    flex: 1,
    textAlign: "left",
    paddingLeft: moderateScale(20),
  },
  footer: {
    alignItems: "center",
    marginTop: moderateScale(16),
    paddingTop: moderateScale(8),
    borderTopWidth: 2,
    borderTopColor: COLORS.black,
  },
  footerText: {
    ...FONTS.body1,
    fontStyle: "italic",
    color: COLORS.text,
    fontSize: SIZES.fontSm,
  },
  actionContainer: {
    flexDirection: "row",
    gap: moderateScale(12),
    marginBottom: moderateScale(20),
  },
  printButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    padding: moderateScale(16),
    borderRadius: SIZES.radius,
    gap: moderateScale(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  printButtonText: { ...FONTS.body1, color: COLORS.white, fontWeight: "600" },
});

export default PaymentDetailScreen;
