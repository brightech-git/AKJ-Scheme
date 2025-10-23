import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Animated,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../../utils/toast";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";

// Constants
const API_BASE_URL = "https://akj.brightechsoftware.com";

// Import COLORS from your theme
import { COLORS, SIZES, FONTS } from "../../utils/Theme";

function Buy() {
  // State variables
  const [amount, setAmount] = useState("");
  const [weight, setWeight] = useState("");
  const [goldRate, setGoldRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [goldRateError, setGoldRateError] = useState(false);
  const [personalInfo, setPersonalInfo] = useState(null); // Add personalInfo state

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Refs for cleanup
  const isMountedRef = useRef(true);

  const navigation = useNavigation();
  const route = useRoute();

  // Route params
  const passedGoldRate = route.params?.goldRate;
  const isDreamGoldPlan = route.params?.isDreamGoldPlan;
  const accountDetails = route.params?.accountDetails;
  const productData = route.params?.productData;
  const schemeInfo = route.params?.schemeInfo; // Get schemeInfo from route params
  console.log("🚀 Product Data:", productData);
  console.log("🚀 Scheme Info:", schemeInfo);
  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Get user details from AsyncStorage
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const [storedPhoneNumber, storedUserName, storedPersonalInfo] =
          await Promise.all([
            AsyncStorage.getItem("userPhoneNumber"),
            AsyncStorage.getItem("username"),
            AsyncStorage.getItem("personalInfo"), // Get personalInfo from storage
          ]);

        if (isMountedRef.current) {
          if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
          if (storedUserName) setUserName(storedUserName);
          if (storedPersonalInfo) {
            try {
              const parsedPersonalInfo = JSON.parse(storedPersonalInfo);
              setPersonalInfo(parsedPersonalInfo);
            } catch (e) {
              console.error("Error parsing personalInfo:", e);
            }
          }
        }
      } catch (error) {
        console.error("Error getting user details:", error);
        if (isMountedRef.current) {
          Alert.alert(
            "Error",
            "Failed to load user details. Please login again."
          );
        }
      }
    };
    getUserDetails();
  }, []);

  // Set initial amount for dream gold plan
  useEffect(() => {
    if (isDreamGoldPlan && accountDetails?.amount) {
      const initialAmount = accountDetails.amount.toString();
      setAmount(initialAmount);
      convertAmountToWeight(initialAmount);
    }
  }, [isDreamGoldPlan, accountDetails, goldRate]);

  // Fetch gold rate from API
  const fetchGoldRate = async () => {
    try {
      setGoldRateError(false);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_BASE_URL}/v1/api/account/todayrate`, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch gold rate`);
      }

      const data = await response.json();

      if (!data.Rate || isNaN(data.Rate)) {
        throw new Error("Invalid gold rate received from server");
      }

      if (isMountedRef.current) {
        setGoldRate(data.Rate);
      }
    } catch (error) {
      console.error("Error fetching gold rate:", error);
      if (isMountedRef.current) {
        setGoldRateError(true);
        setGoldRate(null);

        if (error.name !== "AbortError") {
          Alert.alert(
            "Error",
            "Failed to fetch current gold rate. Please check your internet connection and try again.",
            [
              { text: "Retry", onPress: fetchGoldRate },
              { text: "Cancel", style: "cancel" },
            ]
          );
        }
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Initialize gold rate
  useEffect(() => {
    if (passedGoldRate && !isNaN(passedGoldRate)) {
      setGoldRate(passedGoldRate);
      setLoading(false);
    } else {
      fetchGoldRate();
    }
  }, [passedGoldRate]);

  // Convert amount to weight
  const convertAmountToWeight = useCallback(
    (amount) => {
      if (goldRate && amount && !isNaN(amount) && amount > 0) {
        const weightInGrams = (parseFloat(amount) / goldRate).toFixed(3);
        setWeight(weightInGrams);
      } else {
        setWeight("");
      }
    },
    [goldRate]
  );

  // Handle amount input change
  const handleAmountChange = (text) => {
    const sanitizedText = text.replace(/[^0-9.]/g, "");
    const parts = sanitizedText.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;

    setAmount(sanitizedText);
    convertAmountToWeight(sanitizedText);
  };

  // Prepare orderDetails object for scheme collection
  const prepareOrderDetails = () => {
    return {
      customer: {
        groupCode: productData?.groupcode,
        regNo: productData?.regno,
      },
      amount: amount,
      payType: "ONLINE",
    };
  };

  // Validate payment inputs
  const validatePaymentInputs = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      showToast("Please enter a valid amount greater than 0");
      return false;
    }

    if (parseFloat(amount) < 1) {
      showToast("Minimum payment amount is ₹1");
      return false;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      showToast("Valid phone number not found. Please login again.");
      return false;
    }

    if (!userName || userName.trim().length === 0) {
      showToast("User name not found. Please login again.");
      return false;
    }

    if (!productData || !productData.regno || !productData.groupcode) {
      showToast("Product details are missing. Please try again.");
      return false;
    }

    if (!goldRate) {
      showToast("Gold rate not available. Please refresh and try again.");
      return false;
    }

    return true;
  };

  // Create payment link
  const createPaymentLink = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/payment/create-payment-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            customer: {
              name: userName.trim(),
              contact: phoneNumber,
              REGNO: productData.regno,
              GROUPCODE: productData.groupcode,
            },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${
            errorText || "Failed to generate payment link"
          }`
        );
      }

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error("Invalid response format from server");
      }

      if (!data || !data.payment_link || !data.order_id) {
        throw new Error("Payment link or order ID not received from server");
      }

      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(
          "Request timeout. Please check your internet connection and try again."
        );
      }
      throw error;
    }
  };

  // Handle payment process
  const handlePay = async () => {
    if (!validatePaymentInputs()) {
      return;
    }

    try {
      setPaymentLoading(true);

      console.log("=== PAYMENT INITIATION ===");
      console.log("Payment Details:", {
        amount: amount,
        weight: weight,
        goldRate: goldRate,
        phoneNumber: phoneNumber,
        userName: userName,
        productData: productData,
        isDreamGoldPlan: isDreamGoldPlan,
        personalInfo: personalInfo,
        schemeInfo:
          accountDetails?.schemeSummary?.schemaSummaryTransBalance?.insPaid ||
          0,
        timestamp: new Date().toISOString(),
      });

      const paymentData = await createPaymentLink();

      console.log("=== PAYMENT LINK CREATED ===");
      console.log(
        "Payment Link Response:",
        JSON.stringify(paymentData, null, 2)
      );

      if (isMountedRef.current) {
        // Prepare orderDetails for scheme collection
        const orderDetails = prepareOrderDetails();

        console.log("📦 Prepared Order Details:", orderDetails);
        console.log("👤 Personal Info:", personalInfo);

        // Navigate to PaymentWebView with all necessary data for scheme collection
        navigation.navigate("PaymentWebView", {
          paymentUrl: paymentData.payment_link,
          orderId: paymentData.order_id,
          amount: amount,
          weight: weight,
          goldRate: goldRate,
          phoneNumber: phoneNumber,
          userName: userName,
          productData: productData,
          isDreamGoldPlan: isDreamGoldPlan,
          // Add these parameters for scheme collection
          orderDetails: orderDetails,
          schemeInfo: accountDetails,
          personalInfo: personalInfo,
        });
      }
    } catch (error) {
      console.error("Payment error:", error);

      if (isMountedRef.current) {
        Alert.alert(
          "Payment Error",
          error.message || "Failed to process payment. Please try again.",
          [{ text: "OK" }]
        );
      }
    } finally {
      if (isMountedRef.current) {
        setPaymentLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Gold Rate Card */}
          {!isDreamGoldPlan && (
            <LinearGradient
              colors={[COLORS.gradientcolor9, COLORS.gradientcolor10]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.rateCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Icon name="trending-up" size={22} color={COLORS.goldtext} />
                </View>
                <Text style={styles.cardHeaderText}>Current Gold Rate</Text>
              </View>
              <Text style={styles.cardSubtitle}>
                Value added and GST will be applicable
              </Text>

              <View style={styles.rateContent}>
                <View style={styles.rateSection}>
                  <View style={styles.goldImageContainer}>
                    <Image
                      source={require("../../assets/gold.png")}
                      style={styles.goldImage}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.rateTextContainer}>
                    <Text style={styles.goldText}>Gold 22K (916)</Text>
                    {loading ? (
                      <ActivityIndicator size="small" color={COLORS.goldtext} />
                    ) : goldRateError ? (
                      <TouchableOpacity
                        style={styles.retryButton}
                        onPress={fetchGoldRate}
                      >
                        <Icon name="refresh" size={16} color={COLORS.danger} />
                        <Text style={styles.retryText}>Tap to retry</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.rateText}>{`₹${goldRate} / gm`}</Text>
                    )}
                  </View>
                </View>
              </View>
            </LinearGradient>
          )}

          {/* DREAM GOLD PLAN UI */}
          {isDreamGoldPlan ? (
            <LinearGradient
              colors={[COLORS.gradientcolor7, COLORS.gradientcolor8]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.dreamGoldCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Icon name="card-giftcard" size={22} color={COLORS.white} />
                </View>
                <Text style={styles.cardHeaderText}>DREAM GOLD PLAN</Text>
              </View>

              <View style={styles.detailsContainer}>
                <DetailRow
                  icon="code"
                  label="Group Code"
                  value={productData?.groupcode || "-"}
                />

                <View style={styles.separator} />

                <DetailRow
                  icon="badge"
                  label="Membership No"
                  value={productData?.regno || "-"}
                />

                <View style={styles.separator} />

                <DetailRow
                  icon="account-balance-wallet"
                  label="Scheme Amount"
                  value={productData?.amountWeight?.Amount || "-"}
                />
              </View>

              <View style={styles.paymentOptions}>
                <Text style={styles.paymentOptionsTitle}>
                  Secure Payment Options
                </Text>
                <View style={styles.paymentIcons}>
                  <View style={styles.paymentIconWrapper}>
                    <Image
                      source={require("../../assets/images/gpay.jpeg")}
                      style={styles.paymentIcon}
                    />
                  </View>
                  <View style={styles.paymentIconWrapper}>
                    <Icon
                      name="account-balance"
                      size={32}
                      color={COLORS.white}
                    />
                  </View>
                  <View style={styles.paymentIconWrapper}>
                    <Icon name="credit-card" size={32} color={COLORS.white} />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.payButton,
                  paymentLoading && styles.disabledButton,
                ]}
                onPress={handlePay}
                disabled={paymentLoading}
                activeOpacity={0.8}
              >
                {paymentLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <>
                    <Icon name="lock" size={20} color={COLORS.white} />
                    <Text style={styles.payButtonText}>
                      PROCEED TO SECURE PAYMENT
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            // Quick Pay Card for DigiGold
            <LinearGradient
              colors={[COLORS.gradientcolor9, COLORS.gradientcolor10]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quickPayCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Icon name="flash-on" size={22} color={COLORS.goldtext} />
                </View>
                <Text style={styles.cardHeaderText}>Quick Pay</Text>
              </View>

              <View style={styles.quickPaySection}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputLabelContainer}>
                    <Icon
                      name="currency-rupee"
                      size={18}
                      color={COLORS.goldtext}
                    />
                    <Text style={styles.label}>Enter Amount</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="decimal-pad"
                      value={amount}
                      editable={!isDreamGoldPlan && !paymentLoading}
                      onChangeText={handleAmountChange}
                      placeholder="0.00"
                      placeholderTextColor={COLORS.label}
                      maxLength={10}
                    />
                  </View>
                </View>

                {/* Weight conversion */}
                {!isDreamGoldPlan && weight && (
                  <>
                    <View style={styles.conversionArrow}>
                      <Icon
                        name="swap-vert"
                        size={28}
                        color={COLORS.goldtext}
                      />
                    </View>

                    <View style={styles.weightResultContainer}>
                      <Icon name="scale" size={20} color={COLORS.success} />
                      <View style={styles.weightTextContainer}>
                        <Text style={styles.weightLabel}>You will get</Text>
                        <Text style={styles.weightValue}>
                          {weight}g of 22K Gold
                        </Text>
                      </View>
                    </View>
                  </>
                )}
              </View>

              {/* Payment Button */}
              <TouchableOpacity
                style={[
                  styles.payButton,
                  (paymentLoading ||
                    loading ||
                    !goldRate ||
                    !amount ||
                    parseFloat(amount) <= 0) &&
                    styles.disabledButton,
                ]}
                onPress={handlePay}
                disabled={
                  paymentLoading ||
                  loading ||
                  !goldRate ||
                  !amount ||
                  parseFloat(amount) <= 0
                }
                activeOpacity={0.8}
              >
                {paymentLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <>
                    <Icon name="lock" size={20} color={COLORS.white} />
                    <Text style={styles.payButtonText}>
                      {amount && goldRate
                        ? `Pay ₹${amount}`
                        : "Enter Amount to Continue"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Info Box */}
              {amount && goldRate && (
                <View style={styles.infoContainer}>
                  <Icon name="info-outline" size={18} color={COLORS.info} />
                  <Text style={styles.infoText}>
                    Secure payment gateway • Instant processing
                  </Text>
                </View>
              )}
            </LinearGradient>
          )}

          {/* Security Badge */}
          <View style={styles.securityBadge}>
            <Icon name="verified-user" size={16} color={COLORS.success} />
            <Text style={styles.securityText}>
              Secured with 256-bit SSL encryption
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Detail Row Component
const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLabelContainer}>
      <Icon name={icon} size={18} color={COLORS.goldtext} />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  rateCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  dreamGoldCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: COLORS.goldtext,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  quickPayCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    ...FONTS.heading,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 20,
    marginLeft: 52,
  },
  rateContent: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 16,
    padding: 20,
  },
  rateSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  goldImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  goldImage: {
    width: 40,
    height: 40,
  },
  rateTextContainer: {
    flex: 1,
  },
  goldText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 6,
  },
  rateText: {
    fontSize: 22,
    color: COLORS.goldtext,
    fontWeight: "bold",
    ...FONTS.heading,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  retryText: {
    fontSize: 14,
    color: COLORS.danger,
    marginLeft: 6,
    textDecorationLine: "underline",
  },
  detailsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  detailLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 15,
    color: COLORS.textLight,
    marginLeft: 12,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    marginLeft: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 4,
  },
  paymentOptions: {
    marginBottom: 24,
  },
  paymentOptionsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 16,
  },
  paymentIcons: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  paymentIconWrapper: {
    width: 56,
    height: 56,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  quickPaySection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: COLORS.white,
    marginLeft: 10,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    borderWidth: 2,
    borderColor: "rgba(255, 215, 0, 0.3)",
    borderRadius: 16,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  currencySymbol: {
    fontSize: 24,
    color: COLORS.goldtext,
    fontWeight: "bold",
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "bold",
    padding: 0,
  },
  conversionArrow: {
    alignItems: "center",
    marginVertical: 16,
  },
  weightResultContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  weightTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  weightLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  weightValue: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: "bold",
    ...FONTS.heading,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minHeight: 60,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: COLORS.label,
    opacity: 0.6,
    shadowOpacity: 0,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    letterSpacing: 0.5,
    ...FONTS.heading,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 14,
    backgroundColor: "rgba(66, 165, 245, 0.15)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(66, 165, 245, 0.3)",
  },
  infoText: {
    marginLeft: 10,
    color: COLORS.textLight,
    fontSize: 13,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 12,
    marginTop: 8,
  },
  securityText: {
    marginLeft: 8,
    color: COLORS.textLight,
    fontSize: 12,
  },
});

export default Buy;
