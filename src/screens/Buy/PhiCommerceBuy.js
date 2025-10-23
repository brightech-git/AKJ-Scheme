import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  BackHandler,
  SafeAreaView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from 'expo-linear-gradient';
import { showToast } from "../../utils/toast";
import { COLORS, SIZES, FONTS, moderateScale } from "../../utils/Theme";
import { API_BASE_URL_OLD } from "../../Config/API";
import CommonHeader from "../../components/CommonHeader/CommonHeader";

const API_BASE_URL = "https://scheme.bmgjewellers.com";
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Quick amount suggestions
const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

function Buy() {
  const [amount, setAmount] = useState("");
  const [weight, setWeight] = useState("");
  const [goldRate, setGoldRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [goldRateError, setGoldRateError] = useState(false);
  const [schemeList, setSchemeList] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();

  const passedGoldRate = route.params?.goldRate;
  const accountDetails = route.params?.accountDetails;
  const productData = route.params?.productData;

  const isMountedRef = useRef(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Prevent back press
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => false;
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Load user details
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const [storedPhoneNumber, storedUserName] = await Promise.all([
          AsyncStorage.getItem("userPhoneNumber"),
          AsyncStorage.getItem("userName"),
        ]);
        if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
        if (storedUserName) setUserName(storedUserName);
      } catch {
        Alert.alert("Error", "Failed to load user details.");
      }
    };
    getUserDetails();
  }, []);

  // Fetch scheme list from API
  const fetchSchemes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL_OLD}/member/scheme`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      setSchemeList(data);

      const scheme = data.find((s) => s.SchemeSName === productData?.schemeSName);
      setSelectedScheme(scheme || null);
    } catch (error) {
      console.error("Failed to fetch schemes:", error);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [productData]);

  // Fetch gold rate
  const fetchGoldRate = async () => {
    try {
      setGoldRateError(false);
      const res = await fetch(`${API_BASE_URL_OLD}/account/todayrate`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!data.Rate || isNaN(data.Rate)) throw new Error();
      setGoldRate(data.Rate);
    } catch {
      setGoldRateError(true);
      setGoldRate(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (passedGoldRate && !isNaN(passedGoldRate)) {
      setGoldRate(passedGoldRate);
      setLoading(false);
    } else {
      fetchGoldRate();
    }
  }, [passedGoldRate]);

  const convertAmountToWeight = useCallback(
    (amt) => {
      if (goldRate && amt && !isNaN(amt) && amt > 0) {
        const weightInGrams = (parseFloat(amt) / goldRate).toFixed(3);
        setWeight(weightInGrams);
      } else {
        setWeight("");
      }
    },
    [goldRate]
  );

  const handleAmountChange = (text) => {
    const sanitized = text.replace(/[^0-9.]/g, "");
    setAmount(sanitized);
    convertAmountToWeight(sanitized);
  };

  const handleQuickAmount = (value) => {
    const newAmount = amount ? (parseFloat(amount) + value).toString() : value.toString();
    setAmount(newAmount);
    convertAmountToWeight(newAmount);
  };

  const validatePaymentInputs = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      showToast("Enter valid amount");
      return false;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      showToast("Invalid phone number");
      return false;
    }
    if (!userName || !productData?.regno || !productData?.groupcode) {
      showToast("Missing user/product details");
      return false;
    }
    if (!goldRate) {
      showToast("Gold rate not available");
      return false;
    }
    return true;
  };

  // Payment handler
  const handlePay = async () => {
    if (!validatePaymentInputs()) return;

    try {
      setPaymentLoading(true);
      
      // STEP 1: Create Order
      const orderRes = await fetch(`${API_BASE_URL}/api/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          customer: {
            name: userName.trim(),
            contact: phoneNumber,
            REGNO: productData.regno,
            GROUPCODE: productData.groupcode,
          },
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to create order");
      const orderData = await orderRes.json();
      const orderId = orderData.order_id;

      // STEP 2: Initiate Sale
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found");

      const saleRes = await fetch(`${API_BASE_URL}/api/v1/payment/initiate-sale`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          addlParam1: productData?.regno || "1",
          addlParam2: productData?.groupcode || "145",
          amount: parseFloat(amount),
          currencyCode: "356",
          merchantTxnNo: orderId,
          payType: "0",
          transactionType: "SALE",
          returnURL: "myapp://payment-success",
          customerMobileNo: phoneNumber,
        }),
      });

      if (!saleRes.ok) throw new Error("Failed to initiate payment");
      const saleData = await saleRes.json();
      const tranCtx = saleData.tranCtx;

      // STEP 3: Get Redirect URL
      const redirectRes = await fetch(`${API_BASE_URL}/api/v1/payment/redirect-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tranCtx }),
      });

      if (!redirectRes.ok) throw new Error("Failed to get redirect URL");
      const redirectUrl = await redirectRes.text();

      navigation.navigate("PaymentGateway", {
        paymentUrl: redirectUrl.trim(),
        orderDetails: {
          orderId,
          amount,
          productData,
          customer: { name: userName, contact: phoneNumber },
        },
      });
    } catch (error) {
      console.error("Payment flow error:", error);
      Alert.alert("Payment Error", error.message || "Something went wrong");
    } finally {
      setPaymentLoading(false);
    }
  };

  const showDreamScheme = !selectedScheme?.SchemeSName?.toLowerCase().includes("dream") &&
    !selectedScheme?.SchemeSName?.toLowerCase().includes("digi");

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <CommonHeader title="Gold Purchase" subtitle="Secure your gold investment" />

          {/* Gold Rate - Compact */}
          {showDreamScheme && (
            <Animated.View style={styles.goldRateContainer}>
              <LinearGradient
                colors={COLORS.gradientPrimary6}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.goldRateGradient}
              >
                <View style={styles.goldRateContent}>
                  <View style={styles.goldRateHeader}>
                    <Icon name="trending-up" size={moderateScale(20)} color={COLORS.goldtext} />
                    <Text style={styles.goldRateLabel}>Today's Gold Rate</Text>
                  </View>
                  
                  {loading ? (
                    <ActivityIndicator size="small" color={COLORS.goldtext} />
                  ) : goldRateError ? (
                    <TouchableOpacity onPress={fetchGoldRate} style={styles.retryButton}>
                      <Icon name="refresh" size={moderateScale(16)} color={COLORS.danger} />
                      <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.goldRateValue}>
                      <Text style={styles.goldRatePrice}>₹{goldRate}</Text>
                      <Text style={styles.goldRateUnit}>/gram</Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </Animated.View>
          )}

          {/* Main Payment Card */}
          <View style={styles.paymentCard}>
            {/* Amount Input */}
            <View style={styles.inputSection}>
              <View style={styles.sectionHeader}>
                <Icon name="account-balance-wallet" size={moderateScale(18)} color={COLORS.goldtext} />
                <Text style={styles.sectionTitle}>Payment Amount</Text>
              </View>
              
              <View style={[
                styles.inputContainer,
                focusedInput === "amount" && styles.inputContainerFocused
              ]}>
                <Icon
                  name="currency-rupee"
                  size={moderateScale(24)}
                  color={focusedInput === "amount" ? COLORS.goldtext : COLORS.goldtext1}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={handleAmountChange}
                  onFocus={() => setFocusedInput("amount")}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="0.00"
                  placeholderTextColor={COLORS.label}
                />
              </View>

              {/* Quick Amount Buttons */}
              <View style={styles.quickAmountContainer}>
                <Text style={styles.quickAmountLabel}>
                  <Icon name="flash-on" size={moderateScale(12)} color={COLORS.goldtext} /> Quick Add
                </Text>
                <View style={styles.quickAmountRow}>
                  {QUICK_AMOUNTS.map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={styles.quickAmountButton}
                      onPress={() => handleQuickAmount(value)}
                    >
                      <Text style={styles.quickAmountText}>+₹{value}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Weight Display - Compact */}
            {showDreamScheme && weight && (
              <View style={styles.weightContainer}>
                <View style={styles.weightRow}>
                  <Icon name="balance" size={moderateScale(16)} color={COLORS.goldtext} />
                  <Text style={styles.weightLabel}>Gold Weight:</Text>
                  <Text style={styles.weightValue}>{weight}g</Text>
                </View>
                <Text style={styles.weightInfo}>Based on ₹{goldRate}/gram</Text>
              </View>
            )}

            {/* Transaction Summary - Compact */}
            {amount && parseFloat(amount) > 0 && (
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount:</Text>
                  <Text style={styles.summaryValue}>₹{parseFloat(amount).toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Account:</Text>
                  <Text style={styles.summaryValue}>{productData?.regno || "N/A"}</Text>
                </View>
              </View>
            )}

            {/* Payment Button */}
            <TouchableOpacity
              style={[
                styles.payButton,
                (paymentLoading || !amount || parseFloat(amount) <= 0) && styles.payButtonDisabled,
              ]}
              onPress={handlePay}
              disabled={paymentLoading || !amount || parseFloat(amount) <= 0}
            >
              <LinearGradient
                colors={
                  paymentLoading || !amount || parseFloat(amount) <= 0
                    ? [COLORS.label, COLORS.label1]
                    : COLORS.gradientPrimary6
                }
                style={styles.payButtonGradient}
              >
                {paymentLoading ? (
                  <ActivityIndicator color={COLORS.background} size="small" />
                ) : (
                  <>
                    <Icon name="lock" size={moderateScale(18)} color={COLORS.background} />
                    <Text style={styles.payButtonText}>
                      Pay ₹{parseFloat(amount).toFixed(2) || "0.00"}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Security Badge */}
            <View style={styles.securityBadge}>
              <Icon name="verified-user" size={moderateScale(14)} color={COLORS.success} />
              <Text style={styles.securityText}>Secure • 256-bit SSL</Text>
            </View>
          </View>

          {/* Info Footer - Compact */}
          <View style={styles.infoFooter}>
            <Icon name="info" size={moderateScale(16)} color={COLORS.goldtext} />
            <Text style={styles.infoText}>
              Details will be sent to {phoneNumber || "your registered mobile"}
            </Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: moderateScale(12),
    justifyContent: 'space-between',
    maxHeight: SCREEN_HEIGHT * 0.95,
  },
  header: {
    marginBottom: moderateScale(12),
    borderRadius: moderateScale(16),
    overflow: "hidden",
    height: moderateScale(100),
  },
  headerGradient: {
    flex: 1,
    padding: moderateScale(16),
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    ...FONTS.h5,
    color: COLORS.goldtext,
    marginTop: moderateScale(8),
    textAlign: "center",
  },
  headerSubtitle: {
    ...FONTS.fontSm,
    color: COLORS.goldtext1,
    marginTop: moderateScale(4),
    textAlign: "center",
  },
  goldRateContainer: {
    marginBottom: moderateScale(12),
    borderRadius: moderateScale(12),
    overflow: "hidden",
    height: moderateScale(70),
  },
  goldRateGradient: {
    flex: 1,
    padding: moderateScale(2),
  },
  goldRateContent: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goldRateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  goldRateLabel: {
    ...FONTS.font,
    color: COLORS.goldtext,
    fontWeight: '600',
  },
  goldRateValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: moderateScale(4),
  },
  goldRatePrice: {
    ...FONTS.h4,
    color: COLORS.goldtext,
    fontWeight: '700',
  },
  goldRateUnit: {
    ...FONTS.fontSm,
    color: COLORS.goldtext1,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },
  retryText: {
    ...FONTS.fontSm,
    color: COLORS.danger,
    fontWeight: '600',
  },
  paymentCard: {
    backgroundColor: COLORS.card,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    borderWidth: 1,
    borderColor: COLORS.outline,
    flex: 1,
    justifyContent: 'space-between',
    minHeight: moderateScale(350),
  },
  inputSection: {
    marginBottom: moderateScale(16),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(12),
    gap: moderateScale(8),
  },
  sectionTitle: {
    ...FONTS.h6,
    color: COLORS.goldtext,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    height: moderateScale(56),
    borderWidth: 2,
    borderColor: COLORS.outline,
    marginBottom: moderateScale(12),
  },
  inputContainerFocused: {
    borderColor: COLORS.goldtext,
    backgroundColor: COLORS.surfaceVariant,
  },
  inputIcon: {
    marginRight: moderateScale(12),
  },
  input: {
    flex: 1,
    ...FONTS.h4,
    color: COLORS.text,
    fontWeight: '700',
  },
  quickAmountContainer: {
    marginTop: moderateScale(8),
  },
  quickAmountLabel: {
    ...FONTS.fontSm,
    color: COLORS.goldtext1,
    marginBottom: moderateScale(8),
    fontWeight: '500',
  },
  quickAmountRow: {
    flexDirection: "row",
    flexWrap: 'wrap',
    gap: moderateScale(8),
  },
  quickAmountButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: COLORS.goldtext + '30',
  },
  quickAmountText: {
    ...FONTS.fontSm,
    color: COLORS.goldtext,
    fontWeight: "600",
  },
  weightContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    marginBottom: moderateScale(12),
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
    marginBottom: moderateScale(4),
  },
  weightLabel: {
    ...FONTS.fontSm,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  weightValue: {
    ...FONTS.font,
    color: COLORS.goldtext,
    fontWeight: '700',
  },
  weightInfo: {
    ...FONTS.fontXs,
    color: COLORS.label,
  },
  summaryContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(8),
    padding: moderateScale(12),
    marginBottom: moderateScale(12),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(6),
  },
  summaryLabel: {
    ...FONTS.fontSm,
    color: COLORS.textLight,
  },
  summaryValue: {
    ...FONTS.font,
    color: COLORS.text,
    fontWeight: '600',
  },
  payButton: {
    height: moderateScale(56),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    marginBottom: moderateScale(12),
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
  },
  payButtonText: {
    ...FONTS.h6,
    color: COLORS.background,
    fontWeight: '700',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(6),
  },
  securityText: {
    ...FONTS.fontXs,
    color: COLORS.success,
  },
  infoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
    padding: moderateScale(12),
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(8),
    marginTop: moderateScale(8),
  },
  infoText: {
    ...FONTS.fontSm,
    color: COLORS.textLight,
    textAlign: 'center',
    flex: 1,
  },
});

export default Buy;