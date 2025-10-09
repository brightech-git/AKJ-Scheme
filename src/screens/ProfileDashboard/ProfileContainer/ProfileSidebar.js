import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TextDefault } from "../../../components";
import { colors1 } from "../../../utils/colors";
import { COLORS, FONTS } from "../../../utils/Theme";
import { API_BASE_URL_OLD } from "../../../Config/API";

const { width } = Dimensions.get("window");

const DrawerMenu = ({ isVisible, onClose }) => {
  const navigation = useNavigation();
  const [userPhone, setUserPhone] = useState("");
  const [userName, setUserName] = useState("");
  const slideAnim = useState(new Animated.Value(width * 0.8))[0];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const phoneNumber = await AsyncStorage.getItem("userPhoneNumber");
        if (phoneNumber) {
          setUserPhone(phoneNumber);

          const response = await fetch(
            `${API_BASE_URL_OLD}/account/phonesearch?phoneNo=${phoneNumber}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              setUserName(data[0].pname || "User");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width * 0.8,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isVisible]);

  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Logout canceled"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("mpin");
            await AsyncStorage.removeItem("isMpinCreated");
            await AsyncStorage.removeItem("userPhoneNumber");
            onClose();
            navigation.replace("LoginPage");
          } catch (error) {
            console.error("Error during logout:", error);
          }
        },
      },
    ]);
  };

  const menuItems = [
    { label: "My Scheme", icon: "list", route: "MyScheme" },
    { label: "Help Center", icon: "help-center", route: "HelpCenter" },
    { label: "Privacy Policy", icon: "privacy-tip", route: "PrivacyPolicy" },
    {
      label: "Terms and Conditions",
      icon: "description",
      route: "TermsandCondition",
    },
    { label: 'Delete Account', icon: 'delete', route: 'DeleteButton', iconType: 'MaterialIcons' },
    // { label: 'My Profile', icon: 'account-circle', route: 'MyProfile', iconType: 'MaterialIcons' },
    // { label: 'Change MPIN', icon: 'lock', route: 'ChangeMPIN', iconType: 'MaterialIcons' },
    // { label: 'Set Savings Target', icon: 'track-changes', route: 'SavingsTarget', iconType: 'MaterialIcons' },
    // { label: 'Notification Settings', icon: 'notifications', route: 'NotificationSettings', iconType: 'MaterialIcons' },
    // { label: 'Referral Program', icon: 'card-giftcard', route: 'ReferralProgram', iconType: 'MaterialIcons' },
    // { label: 'History', icon: 'history', route: 'History', iconType: 'MaterialIcons' },
    // { label: 'Settings', icon: 'settings', route: 'Settings', iconType: 'MaterialIcons' },
    { label: 'About', icon: 'info', route: 'AboutPage', iconType: 'MaterialIcons' },
    // { label: 'Support', icon: 'support-agent', route: 'Support', iconType: 'MaterialIcons' },
    // { label: 'Store Locator', icon: 'location-on', route: 'StoreLocator', iconType: 'MaterialIcons' },
  ];

  const handleMenuItemPress = (route) => {
    onClose();
    navigation.navigate(route);
  };

  const renderIcon = (item) => {
    const IconComponent = MaterialIcons;
    return <IconComponent name={item.icon} size={24} color={COLORS.primary} />;
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
        <Animated.View
          style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
        >
          <SafeAreaView style={styles.drawerContent}>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <View style={styles.profileIconContainer}>
                <View style={styles.profileCircle}>
                  <MaterialIcons name="account-circle" size={60}  color={COLORS.primary} />
                </View>
              </View>
              <TextDefault style={styles.welcomeText}>
                Welcome, {userName}
              </TextDefault>
              <TextDefault style={styles.phoneText}>{userPhone}</TextDefault>
            </View>

            {/* Menu Items */}
            <ScrollView
              style={styles.menuContainer}
              showsVerticalScrollIndicator={false}
            >
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item.route)}
                >
                  <View style={styles.menuItemContent}>
                    <View style={styles.iconContainer}>{renderIcon(item)}</View>
                    <TextDefault style={styles.menuItemText}>
                      {item.label}
                    </TextDefault>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Logout Item */}
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <View style={styles.menuItemContent}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="logout" size={24}  color={COLORS.primary} />
                  </View>
                  <TextDefault style={styles.menuItemText}>Logout</TextDefault>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = {
  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayTouchable: {
    flex: 1,
  },
  drawer: {
    width: width * 0.8,
    backgroundColor: "#FFFFFF",
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  drawerContent: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  profileIconContainer: {
    marginBottom: 15,
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  welcomeText: {
    fontSize: 20,
    // fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
    ...FONTS.heading
  },
  phoneText: {
    fontSize: 16,
    color: "#666",
    ...FONTS.body1
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F0F0F0",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
    ...FONTS.body1
  },
};

export default DrawerMenu;
