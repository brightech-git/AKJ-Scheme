// PaymentHistoryScreen.js - Main History Screen
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  ScrollView,
} from "react-native";
import { COLORS, SIZES, FONTS, moderateScale } from "../../utils/Theme";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import CommonHeader from "../../components/CommonHeader/CommonHeader";
import { Ionicons } from "@expo/vector-icons";
import { verticalScale } from "../../utils";

const PaymentHistoryScreen = ({ navigation, route }) => {
  const { accountDetails, schemeName, productdata } = route.params;

  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Get payment history from accountDetails
  const paymentHistory = accountDetails?.paymentHistoryList || [];

  // Format date and time
  const formatDateTime = useCallback((dateTimeString) => {
    if (!dateTimeString) return "N/A";
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  }, []);

  // Format date only
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
    } catch (error) {
      return "Invalid Date";
    }
  }, []);

  // Calculate summary statistics
  const totalAmountPaid = paymentHistory.reduce((total, payment) => {
    return total + parseFloat(payment.amount || 0);
  }, 0);

  const lastPaymentDate =
    paymentHistory.length > 0
      ? paymentHistory[paymentHistory.length - 1].updateTime
      : null;

  const averagePaymentAmount =
    paymentHistory.length > 0 ? totalAmountPaid / paymentHistory.length : 0;

  // Sort payment history
  const sortedHistory = [...paymentHistory].sort((a, b) => {
    const dateA = new Date(a.updateTime || a.date);
    const dateB = new Date(b.updateTime || b.date);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  // Filter payment history
  const filteredHistory = sortedHistory.filter((item) => {
    if (selectedFilter === "all") return true;
    const status = item.status?.toLowerCase() || "paid";
    return selectedFilter === status;
  });

  // Handle payment item press - Navigate to details screen
  const handlePaymentPress = (item) => {
    navigation.navigate("PaymentDetailScreen", {
      payment: item,
      accountDetails,
      schemeName,
      productdata,
    });

    console.log("Navigated Data's:", {
      payment: item,
      accountDetails,
      schemeName,
      productdata,
    });
  };

  // Render payment history item
  const renderPaymentHistory = useCallback(
    ({ item, index }) => {
      const isLastItem = index === filteredHistory.length - 1;
      const status = item.status?.toLowerCase() || "paid";
      const isPaid = status === "paid";
      console.log("ALL DATA'S ", accountDetails);
      console.log("ALL DATA'S ", schemeName);

      return (
        <TouchableOpacity
          style={[styles.transactionCard, isLastItem && styles.lastCard]}
          activeOpacity={0.7}
          onPress={() => handlePaymentPress(item)}
        >
          <View style={styles.transactionIconContainer}>
            <LinearGradient
              colors={
                isPaid ? COLORS.gradientPrimary : [COLORS.warning, "#FFB300"]
              }
              style={styles.transactionIconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons
                name={isPaid ? "check-circle" : "schedule"}
                size={22}
                color={COLORS.white}
              />
            </LinearGradient>
          </View>

          <View style={styles.transactionContent}>
            <Text style={styles.transactionInstallment}>
              Installment {item.installment}
            </Text>

            <Text style={styles.transactionDate}>
              {formatDateTime(item.updateTime)}
            </Text>

            {item.receiptNo && (
              <View style={styles.receiptContainer}>
                <MaterialIcons
                  name="receipt-long"
                  size={12}
                  color={COLORS.textLight}
                />
                <Text style={styles.receiptNo}>{item.receiptNo}</Text>
              </View>
            )}
          </View>

          <View style={styles.transactionRight}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isPaid ? COLORS.success : COLORS.warning },
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {isPaid ? "Paid" : "Pending"}
              </Text>
            </View>

            <Text style={styles.transactionAmount}>
              ₹{parseFloat(item.amount).toLocaleString("en-IN")}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [formatDateTime, filteredHistory.length, accountDetails, schemeName]
  );

  // Render filter chip
  const FilterChip = ({ label, value, count }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedFilter === value && styles.filterChipActive,
      ]}
      onPress={() => setSelectedFilter(value)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterChipText,
          selectedFilter === value && styles.filterChipTextActive,
        ]}
      >
        {label}
      </Text>
      {count > 0 && (
        <View
          style={[
            styles.filterChipBadge,
            selectedFilter === value && styles.filterChipBadgeActive,
          ]}
        >
          <Text
            style={[
              styles.filterChipBadgeText,
              selectedFilter === value && styles.filterChipBadgeTextActive,
            ]}
          >
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const paidCount = paymentHistory.filter(
    (p) => (p.status?.toLowerCase() || "paid") === "paid"
  ).length;
  const pendingCount = paymentHistory.filter(
    (p) => (p.status?.toLowerCase() || "paid") === "pending"
  ).length;

  return (
    <ImageBackground
      source={require("../../assets/bg7.jpg")}
      style={styles.mainBackground}
      imageStyle={styles.backgroundImageStyle}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* CommonHeader Component */}
        <CommonHeader
          title="Payment History"
          showBack={true}
          backIconName="arrow-back"
          backIconColor={COLORS.white}
          backgroundColor="transparent"
          textColor={COLORS.white}
          transparent={true}
          centerTitle={true}
          rightComponent={
            <TouchableOpacity
              onPress={() =>
                setSortOrder(sortOrder === "desc" ? "asc" : "desc")
              }
              activeOpacity={0.7}
              style={styles.sortButtonWrapper}
            >
              <Ionicons
                name={sortOrder === "desc" ? "arrow-down" : "arrow-up"}
                size={22}
                color={COLORS.white}
              />
            </TouchableOpacity>
          }
        />

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.scrollContent}>
            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <View style={styles.summaryIconWrapper}>
                  <MaterialIcons
                    name="account-balance"
                    size={24}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.summaryTitle} numberOfLines={1}>
                  {schemeName ||
                    accountDetails?.schemeSummary?.schemeName?.trim() ||
                    "DREAM GOLD PLAN"}
                </Text>
                <Text style={styles.summaryTitle1} numberOfLines={1}>
                  {accountDetails?.schemeSummary?.schemeName?.trim() || schemeName ||
                    
                    "DREAM GOLD PLAN"}
                </Text>
              </View>

              <View style={styles.summaryStats}>
                <View style={styles.summaryStatItem}>
                  <View style={styles.statIconContainer}>
                    <MaterialIcons
                      name="payments"
                      size={20}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.summaryStatContent}>
                    <Text style={styles.summaryStatLabel}>Total Paid</Text>
                    <Text style={styles.summaryStatValue}>
                      ₹ {totalAmountPaid.toLocaleString("en-IN")}
                    </Text>
                  </View>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryStatItem}>
                  <View style={styles.statIconContainer}>
                    <MaterialIcons
                      name="event"
                      size={20}
                      color={COLORS.secondary}
                    />
                  </View>
                  <View style={styles.summaryStatContent}>
                    <Text style={styles.summaryStatLabel}>Last Payment</Text>
                    <Text style={styles.summaryStatValue}>
                      {formatDate(lastPaymentDate)}
                    </Text>
                  </View>
                </View>

                <View style={styles.summaryDivider} />

                <View style={styles.summaryStatItem}>
                  <View style={styles.statIconContainer}>
                    <MaterialIcons
                      name="trending-up"
                      size={20}
                      color={COLORS.success}
                    />
                  </View>
                  <View style={styles.summaryStatContent}>
                    <Text style={styles.summaryStatLabel}>Avg Payment</Text>
                    <Text style={styles.summaryStatValue}>
                      ₹ {averagePaymentAmount.toFixed(0)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Filter Chips */}
            <View style={styles.filterContainer}>
              <FilterChip
                label="All"
                value="all"
                count={paymentHistory.length}
              />
              <FilterChip label="Paid" value="paid" count={paidCount} />
              <FilterChip
                label="Pending"
                value="pending"
                count={pendingCount}
              />
            </View>

            {/* Payment List */}
            <View style={styles.historySection}>
              <View style={styles.historySectionHeader}>
                <Text style={styles.historyTitle}>Transaction Details</Text>
                <Text style={styles.historyCount}>
                  {filteredHistory.length}{" "}
                  {filteredHistory.length === 1
                    ? "transaction"
                    : "transactions"}
                </Text>
              </View>

              {filteredHistory.length > 0 ? (
                <FlatList
                  data={filteredHistory}
                  renderItem={renderPaymentHistory}
                  keyExtractor={(item, index) =>
                    item.receiptNo || `${item.installment}-${index}`
                  }
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContainer}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconContainer}>
                    <MaterialIcons
                      name="inbox"
                      size={48}
                      color={COLORS.textLight}
                    />
                  </View>
                  <Text style={styles.emptyStateText}>
                    No {selectedFilter !== "all" ? selectedFilter : ""}{" "}
                    transactions
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    {selectedFilter !== "all"
                      ? `No ${selectedFilter} payments found`
                      : "Your payment history will appear here"}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  mainBackground: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImageStyle: {
    opacity: 0.1,
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  sortButtonWrapper: {
    padding: moderateScale(8),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.padding,
    paddingTop: moderateScale(16),
    paddingBottom: moderateScale(24),
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius_lg,
    padding: moderateScale(20),
    marginBottom: moderateScale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(18),
    gap: moderateScale(12),
  },
  summaryIconWrapper: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(14),
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryTitle: {
    ...FONTS.h6,
    color: COLORS.title,
    flex: 1,
    fontSize: SIZES.h6,
  },
  summaryTitle1: {
    ...FONTS.h6,
    color: COLORS.textLight,
    flex: 1,
    fontSize: SIZES.h6,
    alignSelf: "center",
    alignItems:"flex-end"
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: moderateScale(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
  },
  summaryStatItem: {
    flex: 1,
    alignItems: "center",
    gap: moderateScale(10),
  },
  statIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryStatContent: {
    alignItems: "center",
  },
  summaryStatLabel: {
    color: COLORS.textLight,
    marginBottom: moderateScale(4),
    fontSize: SIZES.h6 - 3,
    ...FONTS.body1,
  },
  summaryStatValue: {
    fontSize: SIZES.h6 - 3,
    ...FONTS.body1,
    color: COLORS.title,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.borderColor,
    marginHorizontal: moderateScale(8),
  },
  filterContainer: {
    flexDirection: "row",
    gap: moderateScale(10),
    marginBottom: moderateScale(16),
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
    borderRadius: moderateScale(24),
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    gap: moderateScale(6),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    elevation: 6,
  },
  filterChipText: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: COLORS.white,
    fontWeight: "700",
  },
  filterChipBadge: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(12),
    minWidth: moderateScale(24),
    alignItems: "center",
  },
  filterChipBadgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  filterChipBadgeText: {
    ...FONTS.fontXs,
    color: COLORS.text,
    fontWeight: "700",
  },
  filterChipBadgeTextActive: {
    color: COLORS.white,
  },
  historySection: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius_lg,
    padding: moderateScale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginBottom: moderateScale(20),
  },
  historySectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(16),
  },
  historyTitle: {
    ...FONTS.h6,
    color: COLORS.title,
    fontWeight: "700",
  },
  historyCount: {
    ...FONTS.body1,
    color: COLORS.textLight,
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(14),
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: moderateScale(10),
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: moderateScale(16),
    borderRadius: SIZES.radius,
    marginBottom: moderateScale(12),
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  lastCard: {
    marginBottom: 0,
  },
  transactionIconContainer: {
    marginRight: moderateScale(14),
  },
  transactionIconGradient: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(14),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  transactionContent: {
    flex: 1,
  },
  transactionInstallment: {
    ...FONTS.body1,
    color: COLORS.title,
    fontSize: moderateScale(15),
    marginBottom: moderateScale(6),
  },
  transactionDate: {
    ...FONTS.subheading,
    color: COLORS.textLight,
    marginBottom: moderateScale(6),
    lineHeight: moderateScale(16),
  },
  receiptContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
    marginTop: moderateScale(2),
  },
  receiptNo: {
    ...FONTS.subheading,
    color: COLORS.textLight,
  },
  transactionRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: moderateScale(6),
  },
  statusBadge: {
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(12),
  },
  statusBadgeText: {
    ...FONTS.heading,
    color: COLORS.white,
    letterSpacing: 0.5,
    fontSize: SIZES.fontSm,
  },
  transactionAmount: {
    ...FONTS.h6,
    fontWeight: "800",
    color: COLORS.primary,
    marginRight: verticalScale(4),
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: moderateScale(60),
  },
  emptyIconContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: moderateScale(16),
  },
  emptyStateText: {
    ...FONTS.font,
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: moderateScale(6),
  },
  emptyStateSubtext: {
    ...FONTS.fontSm,
    color: COLORS.textLight,
    opacity: 0.7,
    textAlign: "center",
  },
});

export default PaymentHistoryScreen;