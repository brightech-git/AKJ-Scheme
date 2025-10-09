import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
  ToastAndroid,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { colors1 } from "../../utils/colors";
import styles from "./Styles";
import { LinearGradient } from "expo-linear-gradient";
import DrawerMenu from "../../screens/ProfileDashboard/ProfileContainer/ProfileSidebar";
import { COLORS } from "../../utils/Theme";
import { API_BASE_URL_OLD } from "../../Config/API";

// ========== Constants ==========

const ANIMATION_DURATION = 2000;
const SILVER_ANIMATION_DELAY = 100;

const API_ENDPOINTS = {
  todayRate: `${API_BASE_URL_OLD}/account/todayrate`,
};

// ========== Helpers ==========
const showToast = (message) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert("", message);
  }
};

const formatDate = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedTime = `${hours > 12 ? hours - 12 : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  } ${hours >= 12 ? "PM" : "AM"}`;
  const formattedDate = `${day < 10 ? "0" + day : day}-${
    month < 10 ? "0" + month : month
  }-${year}`;

  return `Rate updated on ${formattedTime} ${formattedDate}`;
};

// ========== Custom Hook: Coin Animation ==========
const useCoinAnimation = (delay = 0) => {
  const animationValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);

  useEffect(() => {
    const startAnimation = () => {
      animationValue.setValue(0);

      const animation = Animated.loop(
        Animated.timing(animationValue, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        })
      );

      if (delay > 0) {
        setTimeout(() => {
          animation.start();
          animationRef.current = animation;
        }, delay);
      } else {
        animation.start();
        animationRef.current = animation;
      }
    };

    startAnimation();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [animationValue, delay]);

  const animatedStyle = useMemo(() => {
    const rotateY = animationValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ["0deg", "180deg", "360deg"],
    });

    const scale = animationValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.6, 1],
    });

    const opacity = animationValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.3, 1],
    });

    return {
      transform: [{ perspective: 1000 }, { rotateY }, { scale }],
      opacity,
    };
  }, [animationValue]);

  return animatedStyle;
};

// ========== Header Component ==========
function Header() {
  const navigation = useNavigation();

  const [goldRate, setGoldRate] = useState(null);
  const [silverRate, setSilverRate] = useState(null);
  const [rateUpdated, setRateUpdated] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const goldAnimatedStyle = useCoinAnimation(0);
  const silverAnimatedStyle = useCoinAnimation(SILVER_ANIMATION_DELAY);

  const toggleDrawer = useCallback(() => {
    setIsDrawerVisible((prev) => !prev);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerVisible(false);
  }, []);

  // Fetch Rates
  const fetchRates = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.todayRate, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGoldRate(data.Rate);
      setSilverRate(data.SILVERRATE);
      setRateUpdated(formatDate(new Date()));
    } catch (error) {
      console.error("Error fetching rates:", error);
      showToast("Failed to fetch rates");
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return (
    <LinearGradient
      colors={[COLORS.gradientcolor7, COLORS.gradientcolor8]} // Gold to Orange gradient - you can change these colors
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.headerContainer1}
    >
      {/* Top Header Section */}
      <View style={styles.topHeaderSection}>
        {/* FAQ Icon */}
        <TouchableOpacity
          style={styles.faqIconContainer}
          onPress={() => navigation.navigate("HelpCenter")}
        >
          <Icon name="help" size={22} color={COLORS.text} />
        </TouchableOpacity>

        {/* Drawer Menu */}
        <DrawerMenu isVisible={isDrawerVisible} onClose={closeDrawer} />

        {/* Logo + Company Name */}
        <View style={styles.mainHeaderSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/image/icon2.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.companyNameContainer}>
            <Text style={styles.companyName}>AKJ JEWELLERS</Text>
            {/* <Text style={styles.companySubtitle}>Pvt Ltd</Text> */}
          </View>
        </View>

        {/* Menu Icon */}
        <TouchableOpacity
          style={styles.menuIconContainer}
          onPress={toggleDrawer}
        >
          <Icon name="menu" size={26} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Rate Cards Overlay Container */}
      <View style={styles.rateCardsOverlayContainer}>
        {/* Gold Rate */}
        <LinearGradient
          colors={["#fff", "#fff", "#fff"]} // Gold gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.rateCardOverlay}
        >
          <View style={styles.rateCardContent}>
            <View style={styles.rateIconContainer}>
              <Animated.View
                style={[styles.animatedCoinContainer, goldAnimatedStyle]}
              >
                <Image
                  source={require("../../assets/gold.png")}
                  style={styles.rateCoinIcon}
                  resizeMode="contain"
                />
              </Animated.View>
            </View>
            <View style={styles.rateTextContainer}>
              <Text style={[styles.rateLabel, styles.goldText]}>Gold Rate</Text>
              <Text style={[styles.rateValue, styles.goldText]}>
                ₹{goldRate || "---"}
              </Text>
              <Text style={[styles.rateUnit, styles.goldText]}>
                22K Per gram
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Silver Rate */}
        <LinearGradient
          colors={["#fff", "#fff", "#fff"]} // Silver gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.rateCardOverlay}
        >
          <View style={styles.rateCardContent}>
            <View style={styles.rateIconContainer}>
              <Animated.View
                style={[styles.animatedCoinContainer, silverAnimatedStyle]}
              >
                <Image
                  source={require("../../assets/silver.png")}
                  style={styles.rateCoinIcon}
                  resizeMode="contain"
                />
              </Animated.View>
            </View>
            <View style={styles.rateTextContainer}>
              <Text style={[styles.rateLabel, styles.silverText]}>
                Silver Rate
              </Text>
              <Text style={[styles.rateValue, styles.silverText]}>
                ₹{silverRate || "---"}
              </Text>
              <Text style={[styles.rateUnit, styles.silverText]}>Per gram</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}
export default React.memo(Header);
