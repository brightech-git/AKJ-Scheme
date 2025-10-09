import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ToastAndroid,
  Platform,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { BottomTab, TextDefault, Slider } from "../../components";
import GoldPlan from "../../ui/ProductCard/GoldPlans";
import ProductCard from "../../ui/ProductCard/ProductCard";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import { colors1 } from "../../utils/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductCardSkeleton from "../../components/SkeletonLoader/ProductCardSkeleton";
import GoldPlansSkeleton from "../../components/SkeletonLoader/GoldPlansSkeleton";
import MainPageWithYouTube from "../Youtube/Youtube";
import MainHeader from "../../components/MainHeader/MainHeader";
import OtpModal from "../../components/VerifyPhone/VerifyPhone";
import { API_BASE_URL_OLD } from "../../Config/API";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_ENDPOINTS = {
  phoneSearch: (phoneNo) =>
    `${API_BASE_URL_OLD}/account/phonesearch?phoneNo=${phoneNo}`,
  account: (regno, groupcode) =>
    `${API_BASE_URL_OLD}/account?regno=${encodeURIComponent(
      regno
    )}&groupcode=${encodeURIComponent(groupcode)}`,
  amountWeight: (regno, groupcode) =>
    `${API_BASE_URL_OLD}/getAmountWeight?REGNO=${encodeURIComponent(
      regno
    )}&GROUPCODE=${encodeURIComponent(groupcode)}`,
  schemes: `${API_BASE_URL_OLD}/member/scheme`,
};

const showToast = (message) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert("", message);
  }
};

const useFetchWithError = () => {
  const fetchData = useCallback(async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        ...options,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }, []);
  return fetchData;
};



// ------------------- SWIPEABLE CARDS COMPONENT -------------------
const SwipeableCards = React.memo(
  ({
    data,
    loading,
    error,
    renderItem,
    renderSkeleton,
    emptyMessage,
    cardWidth = SCREEN_WIDTH * 0.9,
  }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const onMomentumScrollEnd = (event) => {
      const contentOffset = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffset / cardWidth);
      setCurrentIndex(index);
    };

    if (loading) {
      return (
        <View style={styles.swipeableContainer}>
          <FlatList
            data={Array(3).fill()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ index }) => (
              <View style={[styles.cardWrapper, { width: cardWidth }]}>
                {renderSkeleton(index)}
              </View>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
      );
    }

    // FIXED: Check for empty data after loading is complete
    if (error || !data || data.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <TextDefault
            textColor={colors1.error}
            style={{ textAlign: "center", marginTop: 20 }}
          >
            {error || emptyMessage || "No data available"}
          </TextDefault>
        </View>
      );
    }

    return (
      <View style={styles.swipeableContainer}>
        <FlatList
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          renderItem={({ item, index }) => (
            <View style={[styles.cardWrapper, { width: cardWidth }]}>
              {renderItem(item, index)}
            </View>
          )}
          keyExtractor={(item, index) =>
            item.regno && item.groupcode
              ? `${item.regno}-${item.groupcode}-${index}`
              : item.schemeId
              ? `${item.schemeId}-${index}`
              : index.toString()
          }
          decelerationRate="fast"
          snapToInterval={cardWidth}
          snapToAlignment="center"
        />

        {/* Pagination Dots */}
        {data.length > 1 && (
          <View style={styles.paginationContainer}>
            {data.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor:
                      index === currentIndex
                        ? colors1.primary
                        : colors1.lightGray,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  }
);

// ------------------- SECTION HEADER COMPONENT -------------------
const SectionHeader = React.memo(({ title, onViewAll }) => (
  <View style={styles.sectionHeaderContainer}>
    <TextDefault textColor={colors1.primaryText} style={styles.titletext}>
      {title}
    </TextDefault>
    <TouchableOpacity onPress={onViewAll}>
      <TextDefault textColor={colors1.primary} H5 style={styles.viewAllText}>
        View All
      </TextDefault>
    </TouchableOpacity>
  </View>
));

// ------------------- MAIN LANDING COMPONENT -------------------
function MainLanding() {
  const navigation = useNavigation();
  const fetchData = useFetchWithError();

  const [schemes, setSchemes] = useState([]);
  const [productData, setProductData] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [schemesLoading, setSchemesLoading] = useState(true);
  const [schemesError, setSchemesError] = useState(null); // NEW: Separate error state for schemes
  const [productError, setProductError] = useState(null);

  const [showOtpModal, setShowOtpModal] = useState(false);

  // ------------------- FETCH SCHEMES -------------------
  const fetchSchemes = useCallback(async () => {
    try {
      setSchemesLoading(true);
      setSchemesError(null); // Reset error state
      const data = await fetchData(API_ENDPOINTS.schemes);
      
      // FIXED: Check if data is valid and has items
      if (data && Array.isArray(data) && data.length > 0) {
        setSchemes(
          data.map((s) => ({
            schemeId: s.SchemeId,
            schemeName: s.schemeName,
            description: s.SchemeSName,
          }))
        );
      } else {
        setSchemes([]);
        setSchemesError("No Gold Plans available.");
      }
    } catch (error) {
      console.error("Error fetching schemes:", error);
      setSchemesError("Failed to fetch Gold Plans");
      setSchemes([]);
      showToast("Failed to fetch Gold Plans");
    } finally {
      setSchemesLoading(false);
    }
  }, [fetchData]);

  // ------------------- FETCH PRODUCT DATA -------------------
  const fetchProductData = useCallback(async () => {
    setProductLoading(true);
    setProductError(null);
    try {
      const storedPhoneNumber = await AsyncStorage.getItem("userPhoneNumber");
      if (!storedPhoneNumber) throw new Error("Phone number not found");

      const phoneData = await fetchData(API_ENDPOINTS.phoneSearch(storedPhoneNumber));
      if (!phoneData || phoneData.length === 0) {
        setProductError("No Schemes available for this account");
        setProductData([]);
        return;
      }

      const productPromises = phoneData.map(async (item) => {
        const regno = item.regno;
        const groupcode = item.groupcode;
        if (!regno || !groupcode) return null;

        try {
          const [accountData, amountWeightData] = await Promise.all([
            fetchData(API_ENDPOINTS.account(regno, groupcode)),
            fetchData(API_ENDPOINTS.amountWeight(regno, groupcode)),
          ]);

          const maturityDate = item.maturityDate ? new Date(item.maturityDate) : null;
          const isActive = maturityDate !== null;
          const itemStatus = isActive ? "Active" : "Deactive";

          const amountWeight = amountWeightData?.[0] ?? { Weight: 0, Amount: 0 };

          return {
            ...item,
            amountWeight,
            status: itemStatus,
            accountDetails: accountData,
          };
        } catch (err) {
          console.error(`Error fetching account/amountWeight for ${regno}-${groupcode}:`, err);
          return null;
        }
      });

      const resolvedData = await Promise.all(productPromises);
      const validData = resolvedData.filter(Boolean);

      setProductData(validData);
      if (validData.length === 0) {
        setProductError("No Schemes available for this account");
      }
    } catch (err) {
      console.error("Error in fetchProductData:", err);
      setProductError("No Schemes available for this account");
      showToast("No Schemes available for this account");
    } finally {
      setProductLoading(false);
    }
  }, [fetchData]);

  // ------------------- INITIAL FETCH -------------------
  useEffect(() => {
    fetchSchemes();
  }, [fetchSchemes]);
  

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const storedPhone = await AsyncStorage.getItem("userPhoneNumber");
        if (storedPhone && /^\d{10}$/.test(storedPhone)) {
          fetchProductData();
        } else {
          setProductError("No Schemes available for this account");
          setProductData([]);
          setProductLoading(false);
        }
      })();
    }, [fetchProductData])
  );

  const handleOtpVerified = useCallback(() => {
    fetchProductData();
  }, [fetchProductData]);

  // ------------------- HEADER CONTENT -------------------
  const renderHeaderContent = useCallback(
    () => (
      <>
        <MainHeader />
        <Slider />

        <View style={styles.contentWrapper}>
          <Text style={styles.contentText}>
            Welcome to the Digital home of BMG Jewellers:
          </Text>
          <Text style={styles.contentText1}>
            The ideal place to join a savings scheme and save up to buy your
            dream jewels. BMG DIGIGOLD empowers you to save and buy jewels
            conveniently in the palm of your hand. Start saving in gold from
            today.
          </Text>
        </View>

        {/* Your Schemes */}
        <View style={styles.titleSpacer}>
          <SectionHeader
            title="Your Schemes"
            onViewAll={() => navigation.navigate("MyScheme")}
          />

          <SwipeableCards
            data={productData}
            loading={productLoading}
            error={productError}
            emptyMessage="No Schemes available for this account"
            renderItem={(item) => (
              <ProductCard
                productData={item}
                loading={false}
                status={item.status}
                navigation={navigation}
                accountDetails={item.accountDetails}
              />
            )}
            renderSkeleton={(index) => <ProductCardSkeleton key={index} />}
          />
        </View>

        {/* Gold Plans */}
        <View style={styles.contentWrapper}>
          <Text style={styles.contentText}>Customized Gold Plans for You:</Text>
          <Text style={styles.contentText1}>
            Choose from a range of Gold Plans with unique benefits to suit your
            needs and convenience.
          </Text>
        </View>

        <View style={[styles.titleSpacer, { flex: 1 }]}>
          <SectionHeader
            title="Gold Plans"
            onViewAll={() => navigation.navigate("GoldPlanScreen")}
          />

          {/* FIXED: Use schemesError instead of null for error prop */}
          <SwipeableCards
            data={schemes}
            loading={schemesLoading}
            error={schemesError}
            emptyMessage="No Gold Plans available."
            renderItem={(scheme) => (
              <GoldPlan
                schemeId={scheme.schemeId}
                schemeName={scheme.schemeName}
                description={scheme.description}
                styles={styles.itemCardContainer}
              />
            )}
            renderSkeleton={(index) => <GoldPlansSkeleton key={index} />}
            cardWidth={SCREEN_WIDTH * 0.75}
          />
        </View>

        {/* YouTube Section */}
        <View style={styles.youtubeContainer}>
          <View style={styles.youtubeWrapper}>
            <TextDefault
              textColor={colors1.primaryText}
              style={styles.titletext}
            >
              Promotions & Offers
            </TextDefault>
          </View>
          <MainPageWithYouTube />
        </View>
      </>
    ),
    [
      navigation, 
      productLoading, 
      productError, 
      productData, 
      schemes, 
      schemesLoading, 
      schemesError // ADDED: schemesError dependency
    ]
  );

  return (
    <View style={[styles.flex, styles.safeAreaStyle]}>
      <ImageBackground
        source={require("../../assets/bg6.jpg")}
        style={styles.mainBackground}
        imageStyle={styles.backgroundImageStyle}
      >
        <FlatList
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeaderContent}
          data={[]}
          renderItem={null}
        />
        <BottomTab screen="HOME" />

        <OtpModal
          visible={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          onVerified={handleOtpVerified}
          showToast={showToast}
        />
      </ImageBackground>
    </View>
  );
}

export default MainLanding;