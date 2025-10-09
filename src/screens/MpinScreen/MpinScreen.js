import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextDefault } from "../../components";
import { alignment, colors } from "../../utils";
import { colors1 } from "../../utils/colors";
import { COLORS, FONTS } from "../../utils/Theme";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

// Toast function for iOS
const showToast = (message) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert("", message);
  }
};

function MpinScreen({ route, navigation }) {
  const [mpin, setMpin] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    checkIfMpinCreated();
    animateIn();
  }, []);

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const checkIfMpinCreated = async () => {
    try {
      const isMpinCreated = await AsyncStorage.getItem("isMpinCreated");
      if (isMpinCreated === "true") {
        navigation.replace("VerifyMpinScreen");
      }
    } catch (error) {
      console.error("Error checking MPIN creation:", error);
    }
  };

  const handleMpinChange = (value, index) => {
    if (value && !/^\d$/.test(value)) return;

    const newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && !mpin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCreateMpin = async () => {
    const enteredMpin = mpin.join("");

    if (enteredMpin.length !== 4) {
      showToast("Please enter a valid 4-digit MPIN.");
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem("mpin", enteredMpin);
      await AsyncStorage.setItem("isMpinCreated", "true");
      showToast("MPIN created successfully!");
      setTimeout(() => {
        navigation.replace("Drawer");
      }, 1000);
    } catch (error) {
      showToast("Failed to save MPIN. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotMpin = async () => {
    Alert.alert(
      "Reset MPIN",
      "Are you sure you want to reset your MPIN?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("mpin");
              await AsyncStorage.removeItem("isMpinCreated");
              await AsyncStorage.removeItem("isOtpVerified");
              navigation.replace("LoginPage");
            } catch (error) {
              showToast("Failed to reset MPIN. Please try again.");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/bg6.jpg")}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Animated.View
          style={[
            styles.container,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCard}>
              <View style={styles.logoRow}>
                <Image
                  source={require("../../assets/logo2.png")}
                  style={styles.logoImage}
                />
                <TextDefault style={styles.logoText}>
                  AKJ Jewellers
                </TextDefault>
              </View>
              <TextDefault style={styles.subtitleText}>
                (GOLD | SILVER | DIAMOND)
              </TextDefault>
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            <View style={styles.headerSection}>
              <TextDefault style={styles.title}>Create MPIN</TextDefault>
              <TextDefault style={styles.description}>
                Set up a secure 4-digit PIN for quick access
              </TextDefault>
            </View>

            <View style={styles.mpinSection}>
              <TextDefault style={styles.mpinLabel}>
                Enter 4-Digit MPIN
              </TextDefault>

              <View style={styles.mpinContainer}>
                {mpin.map((digit, index) => (
                  <View key={index} style={styles.mpinInputWrapper}>
                    <TextInput
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      style={[
                        styles.mpinInput,
                        digit ? styles.mpinInputFilled : {},
                      ]}
                      maxLength={1}
                      keyboardType="numeric"
                      value={digit}
                      onChangeText={(value) => handleMpinChange(value, index)}
                      onKeyPress={(event) => handleKeyPress(event, index)}
                      secureTextEntry={true}
                      textAlign="center"
                      selectTextOnFocus={true}
                    />
                    {digit ? <View style={styles.filledIndicator} /> : null}
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.actionSection}>
              <TouchableOpacity
                onPress={handleForgotMpin}
                style={styles.forgotButton}
              >
                <TextDefault style={styles.forgotText}>
                  Forgot MPIN?
                </TextDefault>
              </TouchableOpacity>

              {mpin.join("").length === 4 && !isLoading ? (
                // Gradient button when active
                <TouchableOpacity
                  onPress={handleCreateMpin}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={COLORS.gradientPrimary5}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.createButton, styles.gradientButton]}
                  >
                    <TextDefault
                      style={[
                        styles.createButtonText,
                        styles.createButtonTextActive,
                      ]}
                    >
                      {isLoading ? "Creating..." : "Create MPIN"}
                    </TextDefault>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                // Normal button when inactive
                <TouchableOpacity
                  style={[
                    styles.createButton,
                    isLoading ? styles.createButtonLoading : {},
                  ]}
                  onPress={handleCreateMpin}
                  disabled={true}
                >
                  <TextDefault style={styles.createButtonText}>
                    {isLoading ? "Creating..." : "Create MPIN"}
                  </TextDefault>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

function VerifyMpinScreen({ navigation }) {
  const [mpin, setMpin] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inputRefs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    animateIn();
  }, []);

  const animateIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleMpinChange = (value, index) => {
    if (value && !/^\d$/.test(value)) return;

    const newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === "Backspace" && !mpin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyMpin = async () => {
    const enteredMpin = mpin.join("");

    if (enteredMpin.length !== 4) {
      showToast("Please enter a valid 4-digit MPIN.");
      return;
    }

    setIsLoading(true);
    try {
      const savedMpin = await AsyncStorage.getItem("mpin");
      if (enteredMpin === savedMpin) {
        showToast("MPIN verified successfully!");
        setTimeout(() => {
          navigation.replace("Drawer");
        }, 1000);
      } else {
        setAttempts((prev) => prev + 1);
        setMpin(["", "", "", ""]);
        inputRefs.current[0]?.focus();

        if (attempts >= 2) {
          Alert.alert(
            "Too Many Attempts",
            "You have exceeded the maximum number of attempts. Please reset your MPIN.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Reset MPIN", onPress: () => navigation.navigate("LoginPage") },
            ]
          );
        } else {
          showToast(`Incorrect MPIN. ${2 - attempts} attempts remaining.`);
        }
      }
    } catch (error) {
      showToast("Failed to verify MPIN. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/bg6.jpg")}
      style={styles.backgroundImage}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Animated.View
          style={[
            styles.container,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCard}>
              <View style={styles.logoRow}>
                <Image
                  source={require("../../assets/image/icon2.png")}
                  style={styles.logoImage}
                />
                <TextDefault style={styles.logoText}>
                 AKJ Jewellers
                </TextDefault>
              </View>
              <TextDefault style={styles.subtitleText}>
                (GOLD | SILVER | DIAMOND)
              </TextDefault>
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            <View style={styles.headerSection}>
              <TextDefault style={styles.title}>Enter Your MPIN</TextDefault>
              <TextDefault style={styles.description}>
                Enter your 4-digit PIN to continue
              </TextDefault>
            </View>

            <View style={styles.mpinSection}>
              <TextDefault style={styles.mpinLabel}>MPIN</TextDefault>

              <View style={styles.mpinContainer}>
                {mpin.map((digit, index) => (
                  <View key={index} style={styles.mpinInputWrapper}>
                    <TextInput
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      style={[
                        styles.mpinInput,
                        digit ? styles.mpinInputFilled : {},
                      ]}
                      maxLength={1}
                      keyboardType="numeric"
                      value={digit}
                      onChangeText={(value) => handleMpinChange(value, index)}
                      onKeyPress={(event) => handleKeyPress(event, index)}
                      secureTextEntry={true}
                      textAlign="center"
                      selectTextOnFocus={true}
                    />
                    {digit ? <View style={styles.filledIndicator} /> : null}
                  </View>
                ))}
              </View>

              {attempts > 0 && (
                <TextDefault style={styles.attemptsText}>
                  Attempts remaining: {3 - attempts}
                </TextDefault>
              )}
            </View>

            <View style={styles.actionSection}>
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginPage")}
                style={styles.forgotButton}
              >
                <TextDefault style={styles.forgotText}>
                  Forgot MPIN?
                </TextDefault>
              </TouchableOpacity>

              {mpin.join("").length === 4 && !isLoading ? (
                // Gradient button when active
                <TouchableOpacity
                  onPress={handleVerifyMpin}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={COLORS.gradientPrimary5}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.createButton, styles.gradientButton]}
                  >
                    <TextDefault
                      style={[
                        styles.createButtonText,
                        styles.createButtonTextActive,
                      ]}
                    >
                      {isLoading ? "Verifying..." : "Verify MPIN"}
                    </TextDefault>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                // Inactive button
                <TouchableOpacity
                  style={[
                    styles.createButton,
                    isLoading ? styles.createButtonLoading : {},
                  ]}
                  onPress={handleVerifyMpin}
                  disabled={true}
                >
                  <TextDefault style={styles.createButtonText}>
                    {isLoading ? "Verifying..." : "Verify MPIN"}
                  </TextDefault>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  keyboardContainer: {
    flex: 1,
    //  backgroundColor: colors1.background,
  },
  container: {
    flex: 1,

    alignItems: "center",
    marginTop: 60,
  },

  // Logo Section
  logoContainer: {
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    paddingBottom: 20,
  },
  logoCard: {
    backgroundColor: COLORS.label1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors1.borderLight,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  logoImage: {
    width: 40,
    height: 30,
    marginRight: 10,
    borderRadius: 6,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    letterSpacing: 0.8,
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors1.textLight,
    letterSpacing: 1.5,
    opacity: 0.8,
  },

  // Content Section
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: "center",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 30,
  },
  title: {
    fontSize: 26,
    // fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 6,
    textAlign: "center",
    ...FONTS.heading
  },
  description: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: "center",
    opacity: 0.8,
    ...FONTS.font
  },

  // MPIN Section
  mpinSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  mpinLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors1.textPrimary,
    marginBottom: 16,
    alignSelf: "flex-start",
    marginLeft: 6,
  },
  mpinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  mpinInputWrapper: {
    marginHorizontal: 6,
    position: "relative",
  },
  mpinInput: {
    width: 55,
    height: 65,
    borderWidth: 2,
    borderColor: colors1.borderLight,
    borderRadius: 14,
    fontSize: 22,
    fontWeight: "bold",
    backgroundColor: colors1.cardBackground,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    textAlign: "center",
    color: colors1.textPrimary,
  },
  mpinInputFilled: {
    borderColor: COLORS.gradientcolor8,
    backgroundColor: colors1.cardBackground,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  filledIndicator: {
    position: "absolute",
    bottom: -6,
    left: "50%",
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gradientcolor8,
  },
  attemptsText: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: "500",
    marginTop: 6,
  },

  // Action Section
  actionSection: {
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    alignItems: "center",
  },
  forgotButton: {
    paddingVertical: 10,
    marginBottom: 10,
  },
  forgotText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "500",
  },
  createButton: {
    backgroundColor: colors1.borderLight,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    width: 300,
  },
  createButtonActive: {
    backgroundColor: COLORS.gradientPrimary2,
    shadowColor: colors1.primaryDark,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  createButtonLoading: {
    opacity: 0.7,
  },
  createButtonText: {
    color: colors1.textSecondary,
    fontSize: 17,
    fontWeight: "bold",
  },
  createButtonTextActive: {
    color: colors1.textLight,
  },
});

export { MpinScreen, VerifyMpinScreen };
