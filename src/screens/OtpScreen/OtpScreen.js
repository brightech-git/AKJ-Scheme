import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHash, useOtpVerify, removeListener } from "react-native-otp-verify";
import { showToast } from "../../utils/toast";
import appTheme from "../../utils/Theme";
import styles from "./OtpStyles.js";
import userService from "../../services/UserService";

const { COLORS } = appTheme;

function OtpPage({ navigation, route }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [autoCompleteOtp, setAutoCompleteOtp] = useState("");
  const [appHash, setAppHash] = useState([]);
  const [waitingForOtp, setWaitingForOtp] = useState(true);
  const [smsListenerReady, setSmsListenerReady] = useState(false);
  const [showFullScreenLoader, setShowFullScreenLoader] = useState(false); // 🔹 NEW STATE

  const inputRefs = useRef([]);
  const phoneNumber = route.params?.phoneNumber || "";

  const { message, timeoutError, startListener, stopListener } = useOtpVerify({
    numberOfDigits: 6,
  });

  // -------------------- TIMER --------------------
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  // -------------------- DETECT OTP FROM MESSAGE --------------------
  const detectOtpFromMessage = (smsMessage) => {
    if (!smsMessage) return null;
    console.log("📩 Analyzing SMS for OTP:", smsMessage);

    const patterns = [
      /your\s+otp\s+(?:for\s+\w+\s+)?is\s*(\d{6})/i,
      /otp.*?is\s*[:\-]?\s*(\d{6})/i,
      /otp[:\s]+(\d{6})/i,
      /\b(\d{6})\b/,
    ];

    for (const pattern of patterns) {
      const match = smsMessage.match(pattern);
      if (match) {
        const detected = match[1] || match[0];
        console.log("✅ OTP Detected:", detected);
        return detected;
      }
    }

    console.log("❌ No OTP detected");
    return null;
  };

  // -------------------- HANDLE INCOMING SMS --------------------
  useEffect(() => {
    if (message && smsListenerReady) {
      console.log("📨 SMS message received:", message);
      const detectedOtp = detectOtpFromMessage(message);

      if (detectedOtp && detectedOtp.length === 6) {
        setAutoCompleteOtp(detectedOtp);
        setOtp(detectedOtp.split(""));
        setWaitingForOtp(false);
        setShowFullScreenLoader(false); // 🔹 Hide loader when OTP detected
        showToast("OTP detected automatically!");

        setTimeout(() => {
          handleVerifyOtp();
        }, 800);
      }
    }
  }, [message, smsListenerReady]);

  // -------------------- WAITING LOADER (15 seconds) --------------------
  useEffect(() => {
    // Start waiting for OTP for 15 seconds only if SMS listener is ready
    if (smsListenerReady && Platform.OS === "android") {
      setShowFullScreenLoader(true); // 🔹 Show full screen loader when waiting starts
      
      const timer = setTimeout(() => {
        setWaitingForOtp(false);
        setShowFullScreenLoader(false); // 🔹 Hide loader when timeout
        showToast("You can enter OTP manually");
      }, 15000); // 15 seconds

      return () => clearTimeout(timer);
    }
  }, [smsListenerReady]);

  // -------------------- HANDLE TIMEOUT --------------------
  useEffect(() => {
    if (timeoutError) {
      showToast("OTP detection timeout. Please enter it manually.");
      setWaitingForOtp(false);
      setShowFullScreenLoader(false); // 🔹 Hide loader on timeout
    }
  }, [timeoutError]);

  // -------------------- INITIALIZE LISTENER --------------------
  useEffect(() => {
    const initializeSMSListener = async () => {
      if (Platform.OS === "android") {
        try {
          console.log("🔄 Initializing SMS listener...");
          const hashCodes = await getHash();
          setAppHash(hashCodes);
          console.log("📲 App Hash:", hashCodes);
          
          if (startListener) {
            startListener();
            setSmsListenerReady(true);
            console.log("✅ SMS listener started successfully");
          }
        } catch (error) {
          console.error("❌ Error initializing SMS listener:", error);
          setWaitingForOtp(false);
          setSmsListenerReady(false);
          setShowFullScreenLoader(false); // 🔹 Hide loader on error
        }
      } else {
        // For iOS, don't show waiting indicator
        setWaitingForOtp(false);
        setSmsListenerReady(false);
        setShowFullScreenLoader(false);
      }
    };

    initializeSMSListener();

    return () => {
      try {
        removeListener();
        stopListener && stopListener();
        setSmsListenerReady(false);
        setShowFullScreenLoader(false); // 🔹 Hide loader on cleanup
      } catch (error) {
        console.error("Cleanup SMS listener error:", error);
      }
    };
  }, []);

  // -------------------- AUTO VERIFY WHEN ALL DIGITS ENTERED --------------------
  useEffect(() => {
    const otpValue = otp.join("");
    if (otpValue.length === 6 && !verifying && !waitingForOtp) {
      console.log("🔍 Auto-verifying:", otpValue);
      handleVerifyOtp();
    }
  }, [otp]);

  // -------------------- OTP HANDLERS --------------------
  const handleOtpChange = (val, idx) => {
    // If user starts typing manually, stop waiting for auto OTP
    if (val && waitingForOtp) {
      setWaitingForOtp(false);
      setShowFullScreenLoader(false); // 🔹 Hide loader when user starts typing
    }

    const updated = [...otp];
    updated[idx] = val;
    setOtp(updated);

    if (val && idx < otp.length - 1) {
      inputRefs.current[idx + 1]?.focus();
    } else if (!val && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const clearOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setAutoCompleteOtp("");
    inputRefs.current[0]?.focus();
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      showToast("Please enter 6-digit OTP");
      return;
    }

    console.log("✅ Verifying OTP:", otpValue);
    setVerifying(true);
    setShowFullScreenLoader(true); // 🔹 Show loader when verification starts

    try {
      const tempUserData = await AsyncStorage.getItem("tempUserData");
      if (!tempUserData) {
        showToast("User data not found. Please try again.");
        setVerifying(false);
        setShowFullScreenLoader(false); // 🔹 Hide loader on error
        return;
      }

      const { phone } = JSON.parse(tempUserData);
      const res = await userService.verifyOtp(phone, otpValue);

      if (res.success) {
        showToast("OTP verified successfully!");
        await AsyncStorage.removeItem("tempUserData");
        stopListener && stopListener();
        setShowFullScreenLoader(false); // 🔹 Hide loader on success
        navigation.navigate("LoginPage");
      } else {
        showToast(res.error || "OTP verification failed");
        clearOtp();
        setShowFullScreenLoader(false); // 🔹 Hide loader on failure
      }
    } catch (error) {
      console.error("❌ OTP verification error:", error);
      showToast("Verification failed. Please try again.");
      setShowFullScreenLoader(false); // 🔹 Hide loader on error
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    try {
      const tempUserData = await AsyncStorage.getItem("tempUserData");
      if (!tempUserData) {
        showToast("User data not found. Please register again.");
        return;
      }

      const { username, email, phone, password } = JSON.parse(tempUserData);
      const res = await userService.registerUser({
        username,
        email,
        contactNumber: phone,
        password,
      });

      if (res.success) {
        showToast("OTP resent successfully!");
        setResendTimer(20);
        clearOtp();
        
        // Restart waiting for auto OTP
        if (Platform.OS === "android") {
          setWaitingForOtp(true);
          setShowFullScreenLoader(true); // 🔹 Show loader again when resending
          startListener && startListener();
        }
      } else {
        showToast(res.error || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      showToast("Failed to resend OTP. Try again.");
    }
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  // -------------------- UI --------------------
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ImageBackground
        source={require("../../assets/bg7.jpg")}
        style={styles.backgroundImage}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/image/icon2.png")}
                  style={styles.logoImage}
                />
              </View>

              <View style={styles.card}>
                <Text style={styles.title}>Verify OTP</Text>
                <Text style={styles.subtitle}>
                  Enter the 6-digit OTP sent to {"\n"}+91 {phoneNumber}
                </Text>

                {/* Manual OTP input */}
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <LinearGradient
                      key={index}
                      colors={
                        digit
                          ? [COLORS.gradientcolor7, COLORS.gradientcolor8]
                          : [COLORS.background, COLORS.background]
                      }
                      style={styles.otpInputWrapper}
                    >
                      <TextInput
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        style={styles.otpInput}
                        keyboardType="numeric"
                        maxLength={1}
                        value={digit}
                        onChangeText={(val) => handleOtpChange(val, index)}
                        textAlign="center"
                        selectionColor={COLORS.primary}
                        editable={!showFullScreenLoader} // 🔹 Disable input while loader is shown
                      />
                    </LinearGradient>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.clearOtpButton}
                  onPress={clearOtp}
                  disabled={showFullScreenLoader} // 🔹 Disable while loader is shown
                >
                  <Text style={[
                    styles.clearOtpText,
                    showFullScreenLoader && styles.disabledText
                  ]}>
                    Clear OTP
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    showFullScreenLoader && styles.disabledButton,
                  ]}
                  onPress={handleVerifyOtp}
                  disabled={showFullScreenLoader}
                >
                  <LinearGradient
                    colors={
                      showFullScreenLoader
                        ? ["#555", "#444"]
                        : [COLORS.gradientcolor7, COLORS.gradientcolor8]
                    }
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.primaryButtonText}>Verify OTP</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resendContainer}
                  onPress={handleResendOtp}
                  disabled={resendTimer > 0 || showFullScreenLoader}
                >
                  <Text style={styles.resendText}>Didn't receive OTP? </Text>
                  <Text
                    style={[
                      styles.resendLink,
                      (resendTimer > 0 || showFullScreenLoader) && styles.resendDisabled,
                    ]}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("LoginPage")}
                  style={styles.linkContainer}
                  disabled={showFullScreenLoader}
                >
                  <Text style={[
                    styles.linkText,
                    showFullScreenLoader && styles.disabledText
                  ]}>
                    Back to Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* 🔹 FULL SCREEN LOADER FOR BOTH WAITING AND VERIFYING */}
          {showFullScreenLoader && (
            <View style={styles.fullScreenLoader}>
              <View style={styles.loaderBackground} />
              <View style={styles.loaderContent}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>
                  {waitingForOtp && !verifying 
                    ? "Waiting for OTP..." 
                    : "Verifying OTP..."
                  }
                </Text>
                <Text style={styles.loadingSubtext}>
                  {waitingForOtp && !verifying 
                    ? "We're automatically detecting OTP from SMS..."
                    : "Please wait while we verify your OTP"
                  }
                </Text>
                {waitingForOtp && !verifying && (
                  <Text style={styles.loadingTimer}>
                    This will timeout in 15 seconds
                  </Text>
                )}
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

export default OtpPage;