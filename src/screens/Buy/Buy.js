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
  ScrollView,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { showToast } from "../../utils/toast";
import { colors1 } from "../../utils/colors";
import { API_BASE_URL_OLD } from "../../Config/API";

const { width } = Dimensions.get("window");
const API_BASE_URL = "https://scheme.bmgjewellers.com";

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

  const navigation = useNavigation();
  const route = useRoute();

  const passedGoldRate = route.params?.goldRate;
  const accountDetails = route.params?.accountDetails;
  const productData = route.params?.productData;

  const isMountedRef = useRef(true);

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

      // Find the current scheme based on productData
      const scheme = data.find((s) => s.SchemeSName === productData?.schemeSName);
      setSelectedScheme(scheme || null);
    } catch (error) {
      console.error("Failed to fetch schemes:", error);
      Alert.alert("Error", "Failed to fetch schemes");
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
      console.log("Fetched Gold Rate:", data.Rate);
    } catch {
      setGoldRateError(true);
      setGoldRate(null);
      Alert.alert("Error", "Failed to fetch gold rate", [
        { text: "Retry", onPress: fetchGoldRate },
        { text: "Cancel", style: "cancel" },
      ]);
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

  // STEP 1: Create Order
  const createOrder = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/create`, {
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
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Create order error:", errorText);
        throw new Error("Failed to create order");
      }

      const data = await res.json();
      console.log("STEP 1 ✅ Order Created:", data);
      return data.order_id;
    } catch (error) {
      console.error("Order creation failed:", error);
      throw new Error(error.message);
    }
  };

  // STEP 2: Initiate Sale
  const initiateSale = async (orderId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found");

      const payload = {
        addlParam1: productData?.regno || "1",
        addlParam2: productData?.groupcode || "145",
        amount: parseFloat(amount),
        currencyCode: "356",
        merchantTxnNo: orderId,
        payType: "0",
        transactionType: "SALE",
        returnURL: "myapp://payment-success", // <-- Deep link
        customerMobileNo: phoneNumber,
      };

      console.log("STEP 2: Initiating sale with payload:", payload);

      const res = await fetch(`${API_BASE_URL}/api/v1/payment/initiate-sale`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Initiate sale error:", errorText);
        throw new Error("Failed to initiate payment");
      }

      const data = await res.json();
      console.log("STEP 2 ✅ Initiate Sale Response:", data);

      if (!data.tranCtx) throw new Error("Transaction context not received");

      return data.tranCtx;
    } catch (error) {
      console.error("Sale initiation failed:", error);
      throw new Error(error.message);
    }
  };

  // STEP 3: Get Redirect URL
  const getRedirectUrl = async (tranCtx) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/payment/redirect-url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tranCtx }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Redirect URL error:", errorText);
        throw new Error("Failed to get redirect URL");
      }

      const text = await res.text();
      const cleanUrl = text.trim();
      console.log("STEP 3 ✅ Redirect URL Received:", cleanUrl);

      return cleanUrl;
    } catch (error) {
      console.error("Redirect URL failed:", error);
      throw new Error(error.message);
    }
  };

  // STEP 4: Main Payment Handler
  const handlePay = async () => {
    if (!validatePaymentInputs()) return;

    try {
      setPaymentLoading(true);

      console.log("=== PAYMENT FLOW START ===");
      const orderId = await createOrder();
      const tranCtx = await initiateSale(orderId);
      const redirectUrl = await getRedirectUrl(tranCtx);

      console.log(
        "STEP 4 ✅ Navigating to PaymentGateway with URL:",
        redirectUrl
      );

      navigation.navigate("PaymentGateway", {
        paymentUrl: redirectUrl,
        orderDetails: {
          orderId,
          amount,
          productData,
          customer: { name: userName, contact: phoneNumber },
        },
      });
    } catch (error) {
      console.error("Payment flow error:", error);
      Alert.alert("Payment Error", error.message || "Something went wrong", [
        { text: "OK" },
      ]);
    } finally {
      setPaymentLoading(false);
    }
  };

 return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Gold Rate Card */}
        {!selectedScheme?.SchemeSName?.toLowerCase().includes("dream") &&
         !selectedScheme?.SchemeSName?.toLowerCase().includes("digi") && (
          <View style={styles.rateCard}>
            <View style={styles.cardHeader}>
              <Icon name="trending-up" size={20} color={colors1.primary} />
              <Text style={styles.cardHeaderText}>Current Gold Rate</Text>
            </View>
            {loading ? (
              <ActivityIndicator size="small" color={colors1.primary} />
            ) : goldRateError ? (
              <TouchableOpacity onPress={fetchGoldRate}>
                <Text style={styles.retryText}>Tap to retry</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.rateText}>{`₹${goldRate} / gm`}</Text>
            )}
          </View>
        )}

        {/* Payment Card */}
        <View style={styles.quickPayCard}>
          <Text style={styles.inputLabel}>Enter Amount (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="Enter amount in rupees"
            placeholderTextColor={colors1.textSecondary}
          />
          <Text style={styles.inputLabel}>Calculated Weight</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={weight ? `${weight} grams` : ""}
            editable={false}
            placeholder="Weight will be calculated automatically"
            placeholderTextColor={colors1.textSecondary}
          />
          <TouchableOpacity
            style={[styles.payButton, (paymentLoading || !amount) && styles.disabledButton]}
            onPress={handlePay}
            disabled={paymentLoading || !amount}
          >
            {paymentLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>
                {amount ? `Pay ₹${amount}` : "Enter Amount"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors1.background, padding: 16 },
  rateCard: {
    backgroundColor: colors1.cardBackground,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
  },
  quickPayCard: {
    backgroundColor: colors1.cardBackground,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors1.textPrimary,
    marginLeft: 8,
    marginBottom: 12,
  },
  retryText: { color: colors1.error, textDecorationLine: "underline" },
  rateText: { fontSize: 18, fontWeight: "bold", color: colors1.primary },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors1.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors1.borderLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: colors1.textPrimary,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: colors1.sectionBackground,
    color: colors1.textSecondary,
  },
  payButton: {
    backgroundColor: colors1.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
    marginTop: 8,
  },
  disabledButton: { opacity: 0.6 },
  payButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default Buy;
