import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHash } from "react-native-otp-verify";
import { showToast } from "../../utils/toast";
import appTheme from "../../utils/Theme";
import styles from './RegisterStyles'
import userService from "../../services/UserService";

const { COLORS } = appTheme;

function RegisterPage({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [appHash, setAppHash] = useState("");

  // Get app hash on component mount
  useEffect(() => {
    initializeAppHash();
  }, []);

  const initializeAppHash = async () => {
    try {
      if (Platform.OS === "android") {
        const hashCodes = await getHash();
        console.log("App Hash Codes:", hashCodes);
        if (hashCodes && hashCodes.length > 0) {
          setAppHash(hashCodes[0]);
          console.log("Using App Hash:", hashCodes[0]);
        }
      }
    } catch (error) {
      console.error("Error getting app hash:", error);
    }
  };

  const handlePhoneChange = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      setPhone(cleaned);
      setIsPhoneValid(/^[6-9]\d{9}$/.test(cleaned) || cleaned.length === 0);
    }
  };

  const handleRegister = async () => {
    if (!username || !email || !phone || !password) {
      return showToast("Please fill in all fields");
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return showToast("Enter a valid 10-digit Indian mobile number");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return showToast("Enter a valid email address");
    }

    setLoading(true);
    
    try {
      const res = await userService.registerUser({ 
        username, 
        email, 
        contactNumber: phone, 
        password,
        hashKey: appHash || ""
      });

      console.log("Registration response:", res);

      if (res.success) {
        // Save full user data for resend OTP and OTP verification
        await AsyncStorage.setItem("tempUserData", JSON.stringify({
          username,
          email,
          phone,
          password,
          appHash
        }));
        
        showToast("Registration successful! OTP sent.");
        
        // Navigate to OTP page with phone number and hash
        navigation.navigate("OTP", { 
          phoneNumber: phone,
          appHash: appHash 
        });
      } else {
        handleRegistrationError(res.error, res.details);
      }
    } catch (error) {
      console.error("Registration error:", error);
      showToast("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationError = (error, details = {}) => {
    console.log("Registration Error Details:", details);
    
    const errorMessage = error?.toString() || "";
    const errorLower = errorMessage.toLowerCase();
    const detailsMessage = details?.message?.toString() || "";
    const detailsLower = detailsMessage.toLowerCase();

    console.log("Error analysis:", {
      errorMessage,
      errorLower,
      detailsMessage,
      detailsLower
    });

    // Check for email already exists
    if (errorLower.includes("email already exists") || 
        detailsLower.includes("email already exists") ||
        detailsMessage === "Email already exists") {
      showToast("This email is already registered. Please use another email or login.");
      setEmail("");
      // Auto-navigate to login after a brief delay
      setTimeout(() => {
        Alert.alert(
          "Email Already Exists",
          "This email is already registered. Would you like to login?",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Login", 
              onPress: () => navigation.navigate("LoginPage", { prefillEmail: email }) 
            }
          ]
        );
      }, 1500);
      return;
    }

    // Check for phone number already exists
    if (errorLower.includes("contact number already exists") || 
        errorLower.includes("phone already exists") ||
        errorLower.includes("number already exists") ||
        detailsLower.includes("contact number already exists") ||
        detailsLower.includes("phone already exists") ||
        detailsLower.includes("number already exists")) {
      Alert.alert(
        "Number Already Registered",
        "This phone number is already registered. Would you like to login instead?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Login", 
            onPress: () => navigation.navigate("LoginPage", { prefillPhone: phone }) 
          }
        ]
      );
      return;
    }

    // Check for username already exists
    if (errorLower.includes("username already exists") || 
        detailsLower.includes("username already exists")) {
      showToast("This username is already taken. Please choose another or login with existing account.");
      setUsername("");
      // Auto-navigate to login after a brief delay
      setTimeout(() => {
        Alert.alert(
          "Username Already Exists",
          "This username is already taken. Would you like to login?",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Login", 
              onPress: () => navigation.navigate("LoginPage") 
            }
          ]
        );
      }, 1500);
      return;
    }

    // Check for generic "already exists" messages
    if (errorLower.includes("already exists") || 
        detailsLower.includes("already exists")) {
      // Try to extract which field already exists
      if (errorLower.includes("email") || detailsLower.includes("email")) {
        showToast("This email is already registered. Please use another email or login.");
        setEmail("");
        setTimeout(() => {
          Alert.alert(
            "Email Already Exists",
            "This email is already registered. Would you like to login?",
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Login", 
                onPress: () => navigation.navigate("LoginPage", { prefillEmail: email }) 
              }
            ]
          );
        }, 1500);
      } else if (errorLower.includes("phone") || errorLower.includes("contact") || errorLower.includes("number")) {
        Alert.alert(
          "Number Already Registered",
          "This phone number is already registered. Would you like to login instead?",
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Login", 
              onPress: () => navigation.navigate("LoginPage", { prefillPhone: phone }) 
            }
          ]
        );
      } else if (errorLower.includes("username") || detailsLower.includes("username")) {
        showToast("This username is already taken. Please choose another or login with existing account.");
        setUsername("");
        setTimeout(() => {
          Alert.alert(
            "Username Already Exists",
            "This username is already taken. Would you like to login?",
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Login", 
                onPress: () => navigation.navigate("LoginPage") 
              }
            ]
          );
        }, 1500);
      } else {
        // Generic already exists message
        showToast("This user already exists. Redirecting to login...");
        setTimeout(() => {
          navigation.navigate("LoginPage");
        }, 2000);
      }
      return;
    }

    // Default error handling
    showToast(error || detailsMessage || "Registration failed");
  };

  const navigateToLogin = () => {
    navigation.navigate("LoginPage");
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ImageBackground 
        source={require("../../assets/bg6.jpg")} 
        style={styles.backgroundImage}
      >
        <KeyboardAvoidingView 
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <View style={styles.logoContainer}>
                <Image source={require("../../assets/image/icon2.png")} style={styles.logoImage} />
              </View>

              <View style={styles.card}>
                <Text style={styles.title}>Register</Text>
                <Text style={styles.subtitle}>Create a new account</Text>

                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter username"
                  placeholderTextColor={COLORS.black1}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  placeholderTextColor={COLORS.black1}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <Text style={styles.label}>Mobile Number</Text>
                <View style={[styles.inputContainer, !isPhoneValid && styles.inputError]}>
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    style={styles.phoneInput}
                    value={phone}
                    onChangeText={handlePhoneChange}
                    placeholder="Enter 10-digit number"
                    placeholderTextColor={COLORS.black1}
                    maxLength={10}
                    keyboardType="phone-pad"
                  />
                </View>
                {!isPhoneValid && phone.length > 0 && (
                  <Text style={styles.errorText}>Please enter a valid mobile number</Text>
                )}

                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor={COLORS.black1}
                  secureTextEntry
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.disabledButton]}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={loading ? ["#555", "#444"] : [COLORS.gradientcolor7, COLORS.gradientcolor8]}
                    style={styles.buttonGradient}
                  >
                    {loading ? (
                      <ActivityIndicator color={COLORS.white} />
                    ) : (
                      <Text style={styles.primaryButtonText}>Register</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={navigateToLogin} style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={styles.linkText}>Already have an account? </Text>
                  <Text style={styles.linkText1}> Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

export default RegisterPage;