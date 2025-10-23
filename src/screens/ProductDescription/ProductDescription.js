import React, { useState, useCallback, useMemo, useEffect, memo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Share,
  Alert,
  StyleSheet,
  Dimensions,
  Platform,
  AccessibilityInfo,
  BackHandler,
  ImageBackground,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import appTheme from "../../utils/Theme";

const { COLORS, SIZES, FONTS } = appTheme;
const { width, height } = Dimensions.get("window");

// Constants
const SCHEME_TYPES = {
  DREAM_GOLD_PLAN: "DREAM GOLD PLAN",
};

const REFRESH_TIMEOUT = 2000;
const MAX_RECENT_PAYMENTS = 3;
const ANIMATION_DURATION = 300;

// Utility functions
const formatCurrency = (amount) => {
  if (!amount || isNaN(amount)) return "0";
  return parseFloat(amount).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
};

const formatWeight = (weight) => {
  if (!weight || isNaN(weight)) return "0";
  return parseFloat(weight).toFixed(3);
};

// Memoized components for better performance
const ProgressBar = memo(({ percentage, animatedValue }) => {
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: Math.min(percentage, 100),
      duration: ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();
  }, [percentage, animatedValue]);

  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>Progress</Text>
        <Text style={styles.progressPercentage}>{percentage.toFixed(1)}%</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[styles.progressBarFill, { width: progressWidth }]}
        >
          <LinearGradient
            colors={COLORS.gradientText}
            style={styles.progressGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
      </View>
      <View style={styles.progressMilestones}>
        <Text style={styles.milestoneText}>Start</Text>
        <Text style={styles.milestoneText}>50%</Text>
        <Text style={styles.milestoneText}>100%</Text>
      </View>
    </View>
  );
});

const StatItem = memo(({ value, label, testID, icon, trend }) => (
  <View
    style={styles.statItem}
    accessible={true}
    accessibilityLabel={`${label}: ${value}`}
    testID={testID}
  >
    <View style={styles.statIconContainer}>
      <Icon name={icon} size={16} color={COLORS.goldtext} />
    </View>
    <Text style={styles.statValue} numberOfLines={1}>
      {value}
    </Text>
    <Text style={styles.statLabel} numberOfLines={2}>
      {label}
    </Text>
    {trend && (
      <View
        style={[
          styles.trendIndicator,
          trend > 0 ? styles.trendUp : styles.trendDown,
        ]}
      >
        <Icon
          name={trend > 0 ? "arrow-up" : "arrow-down"}
          size={10}
          color={trend > 0 ? COLORS.success : COLORS.error}
        />
      </View>
    )}
  </View>
));

const InfoCard = memo(({ icon, label, value, onPress, testID, iconColor }) => (
  <TouchableOpacity
    style={styles.infoCard}
    onPress={onPress}
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel={`${label}: ${value}`}
    testID={testID}
    activeOpacity={0.7}
    disabled={!onPress}
  >
    <View
      style={[styles.infoCardIcon, iconColor && { backgroundColor: iconColor }]}
    >
      <Icon name={icon} size={18} color={COLORS.primary} />
    </View>
    <Text style={styles.infoCardLabel} numberOfLines={1}>
      {label}
    </Text>
    <Text style={styles.infoCardValue} numberOfLines={2}>
      {value}
    </Text>
  </TouchableOpacity>
));

const PaymentHistoryItem = memo(
  ({ item, index, isLastItem, formatDate, onPress }) => (
    <TouchableOpacity
      style={[styles.transactionCard, isLastItem && styles.lastCard]}
      accessible={true}
      accessibilityLabel={`Payment on ${formatDate(
        item.updateTime
      )}, Installment ${item.installment}, Amount ${item.amount} rupees`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.transactionIcon}>
        <Icon name="check-circle" size={20} color={COLORS.success} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionInstallment}>
          Installment {item.installment}
        </Text>
        <Text style={styles.transactionDate}>
          {formatDate(item.updateTime)}
        </Text>
        {item.receiptNo && (
          <Text style={styles.receiptNumber}>Receipt: {item.receiptNo}</Text>
        )}
      </View>
      <View style={styles.transactionAmountContainer}>
        <Text style={styles.transactionAmount}>
          ₹{formatCurrency(item.amount)}
        </Text>
        {item.goldWeight && (
          <Text style={styles.transactionGold}>
            {formatWeight(item.goldWeight)}g
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )
);

const LoadingState = memo(() => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={styles.loadingText}>Loading transactions...</Text>
  </View>
));

const EmptyState = memo(({ onActionPress }) => (
  <View style={styles.emptyState}>
    <Icon name="inbox" size={48} color={COLORS.borderColor} />
    <Text style={styles.emptyStateText}>No transactions yet</Text>
    <Text style={styles.emptyStateSubtext}>
      Your payment history will appear here once you make payments
    </Text>
    {onActionPress && (
      <TouchableOpacity
        style={styles.emptyActionButton}
        onPress={onActionPress}
      >
        <Text style={styles.emptyActionText}>Make Payment</Text>
      </TouchableOpacity>
    )}
  </View>
));

const SchemePassbook = ({ navigation, route }) => {
  const { productData, status, accountDetails } = route.params || {};

  // Validation
  useEffect(() => {
    if (!productData && !accountDetails) {
      Alert.alert("Error", "Invalid data provided", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  }, [productData, accountDetails, navigation]);

  // State management
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  const progressAnimation = useState(new Animated.Value(0))[0];

  // Memoized calculations
  const isDreamGoldPlan = useMemo(
    () =>
      accountDetails?.schemeSummary?.schemeName?.trim() ===
      SCHEME_TYPES.DREAM_GOLD_PLAN,
    [accountDetails?.schemeSummary?.schemeName]
  );

  // Enhanced date formatting with error handling
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      console.warn("Date formatting error:", error);
      return "Invalid Date";
    }
  }, []);

  // Calculate days until maturity
  const daysUntilMaturity = useMemo(() => {
    if (!productData?.maturityDate) return null;

    try {
      const maturityDate = new Date(productData.maturityDate);
      const today = new Date();
      const diffTime = maturityDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays > 0 ? diffDays : 0;
    } catch {
      return null;
    }
  }, [productData?.maturityDate]);

  // Enhanced scheme statistics with better error handling
  const schemeStats = useMemo(() => {
    try {
      const totalPaid = parseFloat(productData?.amountWeight?.Amount || 0);
      const goldSaved = parseFloat(productData?.amountWeight?.Weight || 0);
      const installmentsPaid =
        accountDetails?.schemeSummary?.schemaSummaryTransBalance?.insPaid || 0;
      const totalInstallments = accountDetails?.schemeSummary?.instalment || 0;
      const progressPercentage =
        totalInstallments > 0
          ? (installmentsPaid / totalInstallments) * 100
          : 0;
      const premiumAmount = parseFloat(accountDetails?.amount || 0);

      return {
        totalPaid: isNaN(totalPaid) ? 0 : totalPaid,
        goldSaved: isNaN(goldSaved) ? 0 : goldSaved,
        installmentsPaid,
        totalInstallments,
        progressPercentage: Math.min(Math.max(progressPercentage, 0), 100),
        premiumAmount: isNaN(premiumAmount) ? 0 : premiumAmount,
        averageRate: goldSaved > 0 ? totalPaid / goldSaved : 0,
      };
    } catch (error) {
      console.warn("Scheme stats calculation error:", error);
      return {
        totalPaid: 0,
        goldSaved: 0,
        installmentsPaid: 0,
        totalInstallments: 0,
        progressPercentage: 0,
        premiumAmount: 0,
        averageRate: 0,
      };
    }
  }, [productData, accountDetails]);

  // Enhanced pull-to-refresh with proper error handling
  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);
    setError(null);

    try {
      // Simulate API call - replace with actual refresh logic
      await new Promise((resolve) => setTimeout(resolve, REFRESH_TIMEOUT));

      // Announce success to screen readers
      AccessibilityInfo.announceForAccessibility("Data refreshed successfully");
      console.log("Data refreshed successfully");
    } catch (error) {
      console.error("Refresh error:", error);
      const errorMessage = "Failed to refresh data";
      setError(errorMessage);

      Alert.alert(
        "Refresh Failed",
        "Unable to refresh data. Please check your connection and try again.",
        [{ text: "OK", style: "default" }]
      );

      AccessibilityInfo.announceForAccessibility(errorMessage);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  // Enhanced share functionality
  const handleShare = useCallback(async () => {
    try {
      const schemeName = productData?.pname || "Gold Scheme";
      const message = `📊 My ${schemeName} Details:

💰 Total Invested: ₹${formatCurrency(schemeStats.totalPaid)}
${
  isDreamGoldPlan
    ? `📈 Progress: ${schemeStats.installmentsPaid}/${
        schemeStats.totalInstallments
      } installments (${schemeStats.progressPercentage.toFixed(1)}%)`
    : `🏆 Gold Accumulated: ${formatWeight(schemeStats.goldSaved)}g`
}
${
  schemeStats.averageRate > 0
    ? `💎 Average Rate: ₹${formatCurrency(schemeStats.averageRate)}/g\n`
    : ""
}📅 Join Date: ${formatDate(productData?.joindate)}
🎯 Maturity Date: ${formatDate(productData?.maturityDate)}
${
  daysUntilMaturity !== null
    ? `⏰ Days Until Maturity: ${daysUntilMaturity}\n`
    : ""
}
Shared via Gold Scheme App`;

      const result = await Share.share({
        message,
        title: `${schemeName} - Passbook Details`,
      });

      if (result.action === Share.sharedAction) {
        AccessibilityInfo.announceForAccessibility(
          "Content shared successfully"
        );
        console.log("Content shared successfully");
      }
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert("Share Failed", "Unable to share content at the moment.");
    }
  }, [
    productData,
    schemeStats,
    isDreamGoldPlan,
    formatDate,
    daysUntilMaturity,
  ]);

  // Navigation handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleViewAllPayments = useCallback(() => {
    navigation.navigate("PaymentHistory", {
      accountDetails,
      schemeName: productData?.pname,
      productData,
    });
  }, [navigation, accountDetails, productData]);

  const handleMakePayment = useCallback(() => {
    navigation.navigate("Buy", {
      productData,
      status,
      accountDetails,
      isDreamGoldPlan,
    });
  }, [navigation, productData, status, accountDetails, isDreamGoldPlan]);

  const handleTransactionPress = useCallback(
    (transaction) => {
      setExpandedTransaction(
        expandedTransaction === transaction.receiptNo
          ? null
          : transaction.receiptNo
      );
    },
    [expandedTransaction]
  );

  // Back handler for Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [handleBack]);

  // Screen reader announcement for updates
  useEffect(() => {
    if (error) {
      AccessibilityInfo.announceForAccessibility(`Error: ${error}`);
    }
  }, [error]);

  // Memoized payment history list
  const paymentHistoryList = useMemo(() => {
    const payments = accountDetails?.paymentHistoryList || [];
    return payments.slice(0, MAX_RECENT_PAYMENTS);
  }, [accountDetails?.paymentHistoryList]);

  const totalPayments = accountDetails?.paymentHistoryList?.length || 0;

  // Scheme maturity status
  const maturityStatus = useMemo(() => {
    if (daysUntilMaturity === null) return null;

    if (daysUntilMaturity === 0) return "Matured Today";
    if (daysUntilMaturity < 0) return "Matured";
    if (daysUntilMaturity <= 30) return "Maturing Soon";
    return null;
  }, [daysUntilMaturity]);

  return (
    <ImageBackground
      source={require("../../assets/bg7.jpg")}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        {/* Custom Header */}
        <View style={styles.customHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            testID="back-button"
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Gold Passbook</Text>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Share passbook details"
            testID="share-button"
            activeOpacity={0.7}
          >
            <Icon name="share-alt" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
              title="Pull to refresh"
              titleColor={COLORS.textLight}
            />
          }
          contentContainerStyle={styles.scrollContent}
          testID="scheme-passbook-scroll"
        >
          {/* Scheme Card */}
          <View style={styles.schemeCard}>
            <LinearGradient
              colors={[COLORS.gradientcolor11, COLORS.gradientcolor12]}
              style={styles.schemeCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.schemeNameContainer}>
                <View style={styles.schemeNameLeft}>
                  <Text style={styles.schemeName1} numberOfLines={2}>
                    {productData?.pname || "Gold Savings Scheme"}
                  </Text>
                  <Text style={styles.schemeName} numberOfLines={2}>
                    {accountDetails?.schemeSummary?.schemeName ||
                      "Gold Savings Scheme"}
                  </Text>
                </View>

                {maturityStatus && (
                  <View style={styles.maturityBadge}>
                    <Icon
                      name="calendar-check-o"
                      size={12}
                      color={COLORS.warning}
                    />
                    <Text style={styles.maturityBadgeText}>
                      {maturityStatus}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.schemeStatus}>
                  Status:{" "}
                  <Text style={styles.statusActive}>{status || "Active"}</Text>
                </Text>

                {isDreamGoldPlan && schemeStats.premiumAmount > 0 && (
                  <Text style={styles.premiumAmount}>
                    Premium: ₹{formatCurrency(schemeStats.premiumAmount)}
                  </Text>
                )}
              </View>

              {isDreamGoldPlan && (
                <ProgressBar
                  percentage={schemeStats.progressPercentage}
                  animatedValue={progressAnimation}
                />
              )}
            </LinearGradient>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <StatItem
              value={`₹${formatCurrency(schemeStats.totalPaid)}`}
              label="Total Invested"
              testID="total-paid-stat"
              icon="money"
            />

            <StatItem
              value={
                isDreamGoldPlan
                  ? `${schemeStats.installmentsPaid}/${schemeStats.totalInstallments}`
                  : `${formatWeight(schemeStats.goldSaved)}g`
              }
              label={isDreamGoldPlan ? "Installments" : "Gold Accumulated"}
              testID="secondary-stat"
              icon={isDreamGoldPlan ? "calendar-check-o" : "database"}
            />

            {schemeStats.averageRate > 0 && !isDreamGoldPlan && (
              <StatItem
                value={`₹${formatCurrency(schemeStats.averageRate)}`}
                label="Avg. Rate/g"
                testID="average-rate-stat"
                icon="line-chart"
              />
            )}
          </View>

          {/* Info Cards */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Scheme Details</Text>
            <View style={styles.infoCardsContainer}>
              <InfoCard
                icon="calendar"
                label="Join Date"
                value={formatDate(productData?.joindate)}
                testID="join-date-card"
                iconColor={COLORS.primaryLight}
              />

              <InfoCard
                icon="calendar-check-o"
                label="Maturity Date"
                value={formatDate(productData?.maturityDate)}
                testID="maturity-date-card"
                iconColor={COLORS.primaryLight}
              />

              {daysUntilMaturity !== null && daysUntilMaturity >= 0 && (
                <InfoCard
                  icon="clock-o"
                  label="Days Left"
                  value={`${daysUntilMaturity} days`}
                  testID="days-left-card"
                  iconColor={
                    daysUntilMaturity <= 30
                      ? "rgba(255, 152, 0, 0.2)"
                      : COLORS.primaryLight
                  }
                />
              )}

              {/* {schemeStats?.goldSaved > 0 && (
                <InfoCard
                  icon="balance-scale"
                  label="Gold Saved"
                  value={`${formatWeight(schemeStats.goldSaved)} g`}
                  testID="gold-saved-card"
                  iconColor={COLORS.primaryLight}
                />
              )} */}

              {/* {totalPayments > 0 && (
                <InfoCard
                  icon="list"
                  label="Total Payments"
                  value={`${totalPayments}`}
                  testID="total-payments-card"
                  iconColor={COLORS.primaryLight}
                />
              )} */}
            </View>
          </View>

          {/* Quick Actions */}
          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
              {/* Show Make Payment only when insPaid is not equal to installment */}
              {schemeStats.installmentsPaid !==
                schemeStats.totalInstallments && (
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={handleMakePayment}
                  activeOpacity={0.7}
                >
                  <Icon name="credit-card" size={20} color={COLORS.goldtext} />
                  <Text style={styles.quickActionText}>Make Payment</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={handleViewAllPayments}
                activeOpacity={0.7}
                disabled={totalPayments === 0}
              >
                <Icon
                  name="history"
                  size={20}
                  color={
                    totalPayments > 0 ? COLORS.goldtext : COLORS.borderColor
                  }
                />
                <Text
                  style={[
                    styles.quickActionText,
                    totalPayments === 0 && styles.quickActionTextDisabled,
                  ]}
                >
                  View History
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <Icon name="share-alt" size={20} color={COLORS.goldtext} />
                <Text style={styles.quickActionText}>Share Details</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment History Section */}
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.sectionTitle}>
                Recent Payments {totalPayments > 0 && `(${totalPayments})`}
              </Text>

              {totalPayments > MAX_RECENT_PAYMENTS && (
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={handleViewAllPayments}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="View all payment history"
                  testID="view-all-button"
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                  <Icon name="chevron-right" size={12} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Payment History Content */}
            {loading ? (
              <LoadingState />
            ) : paymentHistoryList.length > 0 ? (
              <View style={styles.transactionsList}>
                {paymentHistoryList.map((item, index) => (
                  <PaymentHistoryItem
                    key={`payment-${
                      item.receiptNo || `${item.installment}-${index}`
                    }`}
                    item={item}
                    index={index}
                    isLastItem={index === paymentHistoryList.length - 1}
                    formatDate={formatDate}
                    onPress={() => handleTransactionPress(item)}
                  />
                ))}
              </View>
            ) : (
              <EmptyState onActionPress={handleMakePayment} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    borderBottomColor: COLORS.borderColor,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius + 7,
  },
  headerTitle: {
    ...FONTS.h5,
    color: COLORS.title,
    flex: 1,
    textAlign: "center",
  },
  shareButton: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius + 7,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  schemeCard: {
    margin: SIZES.margin,
    borderRadius: SIZES.radius_lg,
    overflow: "hidden",
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  schemeCardGradient: {
    padding: SIZES.padding,
  },
  schemeNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  schemeNameLeft: {
    flex: 1,
    marginRight: 8,
  },
  schemeName: {
    ...FONTS.h6,
    color: COLORS.white,
    marginTop: 4,
    opacity: 0.9,
  },
  schemeName1: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: "600",
  },
  maturityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  maturityBadgeText: {
    ...FONTS.fontXs,
    color: COLORS.warning,
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.margin,
  },
  schemeStatus: {
    ...FONTS.subheading,
    color: COLORS.outline,
    fontSize: SIZES.h6,
  },
  statusActive: {
    fontWeight: "600",
    color: COLORS.warning,
  },
  premiumAmount: {
    ...FONTS.subheading,
    color: COLORS.white,
    fontSize: SIZES.h6,
    fontWeight: "600",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    ...FONTS.h6,
    color: COLORS.white,
    fontWeight: "500",
  },
  progressPercentage: {
    ...FONTS.h6,
    color: COLORS.black,
    fontWeight: "600",
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  progressGradient: {
    flex: 1,
  },
  progressMilestones: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  milestoneText: {
    ...FONTS.fontXs,
    color: COLORS.white,
    opacity: 0.6,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: SIZES.margin,
    marginBottom: SIZES.margin,
  },
  statItem: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 6,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: "relative",
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    color: COLORS.text,
    marginBottom: 4,
    ...FONTS.h5,
    fontWeight: "600",
  },
  statLabel: {
    ...FONTS.h6,
    color: COLORS.textLight,
    textAlign: "center",
    fontSize: SIZES.h6,
  },
  trendIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  trendUp: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
  },
  trendDown: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  infoSection: {
    marginHorizontal: SIZES.margin,
    marginBottom: SIZES.margin,
  },
  sectionTitle: {
    ...FONTS.h5,
    color: COLORS.title,
    marginBottom: SIZES.margin,
    fontWeight: "600",
  },
  infoCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    width: (width - SIZES.margin * 2 - 12) / 3,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  infoCardLabel: {
    ...FONTS.h6,
    color: COLORS.text,
    textAlign: "center",
    fontSize: SIZES.h6,
    marginBottom: 4,
  },
  infoCardValue: {
    ...FONTS.h6,
    color: COLORS.goldtext,
    textAlign: "center",
    fontSize: SIZES.h6,
    fontWeight: "600",
  },
  quickActionsSection: {
    marginHorizontal: SIZES.margin,
    marginBottom: SIZES.margin,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: "center",
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  quickActionText: {
    ...FONTS.fontXs,
    color: COLORS.text,
    marginTop: 8,
    fontWeight: "500",
    textAlign: "center",
  },
  quickActionTextDisabled: {
    color: COLORS.borderColor,
  },
  historySection: {
    backgroundColor: COLORS.card1,
    marginHorizontal: SIZES.margin,
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.margin,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewAllText: {
    ...FONTS.fontXs,
    color: COLORS.primary,
    fontWeight: "500",
    marginRight: 4,
  },
  transactionsList: {
    marginTop: 8,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius + 4,
    padding: SIZES.padding,
  },
  lastCard: {
    borderBottomWidth: 0,
  },
  transactionIcon: {
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionInstallment: {
    ...FONTS.font,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 4,
  },
  transactionDate: {
    ...FONTS.fontXs,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  receiptNumber: {
    ...FONTS.fontXs,
    color: COLORS.textLight,
    fontStyle: "italic",
  },
  transactionAmountContainer: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    ...FONTS.font,
    fontWeight: "600",
    color: COLORS.success,
    marginBottom: 2,
  },
  transactionGold: {
    ...FONTS.fontXs,
    color: COLORS.primary,
    fontWeight: "500",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: SIZES.padding * 2,
  },
  loadingText: {
    ...FONTS.font,
    color: COLORS.textLight,
    marginTop: SIZES.margin / 1.5,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: SIZES.padding * 2,
  },
  emptyStateText: {
    ...FONTS.font,
    fontWeight: "500",
    color: COLORS.textLight,
    marginTop: SIZES.margin,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    ...FONTS.fontXs,
    color: COLORS.textLight,
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  emptyActionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: SIZES.radius_sm,
  },
  emptyActionText: {
    ...FONTS.font,
    color: COLORS.white,
    fontWeight: "600",
  },
});

export default memo(SchemePassbook);
