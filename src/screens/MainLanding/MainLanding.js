import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
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
  ActivityIndicator,
  RefreshControl,
  Animated,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { BottomTab, TextDefault, Slider } from "../../components";
import GoldPlan from "../../ui/ProductCard/GoldPlans";
import ProductCard from "../../ui/ProductCard/ProductCard";
import styles from "./styles";
import { colors1 } from "../../utils/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductCardSkeleton from "../../components/SkeletonLoader/ProductCardSkeleton";
import GoldPlansSkeleton from "../../components/SkeletonLoader/GoldPlansSkeleton";
import MainPageWithYouTube from "../Youtube/Youtube";
import MainHeader from "../../components/MainHeader/MainHeader";
import OtpModal from "../../components/VerifyPhone/VerifyPhone";
import { API_BASE_URL_OLD } from "../../Config/API";
import { moderateScale } from "../../utils/scaling";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ------------------- CONSTANTS -------------------
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

const CARD_WIDTHS = {
  product: SCREEN_WIDTH * moderateScale(0.9),
  goldPlan: SCREEN_WIDTH * moderateScale(0.75),
};

const SKELETON_COUNT = 3;
const FETCH_TIMEOUT = 15000; // 15 seconds

// ------------------- UTILITIES -------------------
const showToast = (message) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert("", message);
  }
};

// Enhanced fetch hook with timeout and retry logic
const useFetchWithError = () => {
  const fetchData = useCallback(async (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection.');
      }
      
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
    skeletonCount = SKELETON_COUNT,
  }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (!loading && data?.length > 0) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }, [loading, data, fadeAnim]);

    const onMomentumScrollEnd = useCallback(
      (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / cardWidth);
        setCurrentIndex(index);
      },
      [cardWidth]
    );

    const getItemLayout = useCallback(
      (_, index) => ({
        length: cardWidth,
        offset: cardWidth * index,
        index,
      }),
      [cardWidth]
    );

    const keyExtractor = useCallback((item, index) => {
      if (item?.regno && item?.groupcode) {
        return `${item.regno}-${item.groupcode}-${index}`;
      }
      if (item?.schemeId) {
        return `${item.schemeId}-${index}`;
      }
      return `item-${index}`;
    }, []);

    if (loading) {
      return (
        <View style={styles.swipeableContainer}>
          <FlatList
            data={Array(skeletonCount).fill(null)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ index }) => (
              <View style={[styles.cardWrapper, { width: cardWidth }]}>
                {renderSkeleton(index)}
              </View>
            )}
            keyExtractor={(_, index) => `skeleton-${index}`}
            getItemLayout={getItemLayout}
          />
        </View>
      );
    }

    if (error || !data || data.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateContent}>
            <Text style={styles.emptyStateIcon}>
              {error ? "⚠️" : "📦"}
            </Text>
            <TextDefault
              textColor={error ? colors1.error : colors1.textSecondary}
              style={styles.emptyStateText}
            >
              {error || emptyMessage || "No data available"}
            </TextDefault>
          </View>
        </View>
      );
    }

    return (
      <Animated.View style={[styles.swipeableContainer, { opacity: fadeAnim }]}>
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
          keyExtractor={keyExtractor}
          decelerationRate="fast"
          snapToInterval={cardWidth}
          snapToAlignment="center"
          getItemLayout={getItemLayout}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          windowSize={3}
          removeClippedSubviews={Platform.OS === 'android'}
        />

        {data.length > 1 && (
          <View style={styles.paginationContainer}>
            {data.map((_, index) => (
              <View
                key={`dot-${index}`}
                style={[
                  styles.paginationDot,
                  index === currentIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </Animated.View>
    );
  }
);

SwipeableCards.displayName = "SwipeableCards";

// ------------------- SECTION HEADER COMPONENT -------------------
const SectionHeader = React.memo(({ title, onViewAll, showViewAll = true }) => (
  <View style={styles.sectionHeaderContainer}>
    <TextDefault textColor={colors1.primaryText} style={styles.titletext}>
      {title}
    </TextDefault>
    {showViewAll && (
      <TouchableOpacity
        onPress={onViewAll}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.viewAllButton}
      >
        <TextDefault textColor={colors1.text} style={styles.viewAllText}>
          View All →
        </TextDefault>
      </TouchableOpacity>
    )}
  </View>
));

SectionHeader.displayName = "SectionHeader";

// ------------------- INFO CARD COMPONENT -------------------
const InfoCard = React.memo(({ title, description }) => (
  <View style={styles.contentWrapper}>
    <Text style={styles.contentText}>{title}</Text>
    <Text style={styles.contentText1}>{description}</Text>
  </View>
));

InfoCard.displayName = "InfoCard";

// ------------------- MAIN LANDING COMPONENT -------------------
function MainLanding() {
  const navigation = useNavigation();
  const fetchData = useFetchWithError();
  const isMountedRef = useRef(true);

  // State Management
  const [schemes, setSchemes] = useState([]);
  const [productData, setProductData] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [schemesLoading, setSchemesLoading] = useState(true);
  const [schemesError, setSchemesError] = useState(null);
  const [productError, setProductError] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ------------------- FETCH SCHEMES -------------------
  const fetchSchemes = useCallback(async () => {
    try {
      setSchemesLoading(true);
      setSchemesError(null);

      const data = await fetchData(API_ENDPOINTS.schemes);

      if (!isMountedRef.current) return;

      if (data && Array.isArray(data) && data.length > 0) {
        const mappedSchemes = data.map((s) => ({
          schemeId: s.SchemeId,
          schemeName: s.schemeName,
          description: s.SchemeSName,
        }));
        setSchemes(mappedSchemes);
      } else {
        setSchemes([]);
        setSchemesError("No Gold Plans available at the moment.");
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      
      console.error("Error fetching schemes:", error);
      setSchemesError(
        error.message || "Unable to fetch Gold Plans. Please try again later."
      );
      setSchemes([]);
      showToast("Failed to fetch Gold Plans");
    } finally {
      if (isMountedRef.current) {
        setSchemesLoading(false);
      }
    }
  }, [fetchData]);

  // ------------------- FETCH PRODUCT DATA -------------------
  const fetchProductData = useCallback(async () => {
    setProductLoading(true);
    setProductError(null);

    try {
      const storedPhoneNumber = await AsyncStorage.getItem("userPhoneNumber");

      if (!storedPhoneNumber || !/^\d{10}$/.test(storedPhoneNumber)) {
        throw new Error("Invalid phone number");
      }

      const phoneData = await fetchData(
        API_ENDPOINTS.phoneSearch(storedPhoneNumber)
      );

      if (!isMountedRef.current) return;

      if (!phoneData || phoneData.length === 0) {
        setProductError("No schemes found for your account");
        setProductData([]);
        return;
      }

      const productPromises = phoneData.map(async (item) => {
        const { regno, groupcode } = item;
        if (!regno || !groupcode) return null;

        try {
          const [accountData, amountWeightData] = await Promise.all([
            fetchData(API_ENDPOINTS.account(regno, groupcode)),
            fetchData(API_ENDPOINTS.amountWeight(regno, groupcode)),
          ]);

          const maturityDate = item.maturityDate
            ? new Date(item.maturityDate)
            : null;
          const isActive = maturityDate !== null;
          const itemStatus = isActive ? "Active" : "Inactive";

          const amountWeight = amountWeightData?.[0] ?? {
            Weight: 0,
            Amount: 0,
          };

          return {
            ...item,
            amountWeight,
            status: itemStatus,
            accountDetails: accountData,
          };
        } catch (err) {
          console.error(
            `Error fetching details for ${regno}-${groupcode}:`,
            err
          );
          return null;
        }
      });

      const resolvedData = await Promise.all(productPromises);
      
      if (!isMountedRef.current) return;
      
      const validData = resolvedData.filter(Boolean);

      setProductData(validData);

      if (validData.length === 0) {
        setProductError("No active schemes found");
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      
      console.error("Error in fetchProductData:", err);
      setProductError(
        err.message || "Unable to load your schemes"
      );
      setProductData([]);
      showToast("Failed to load schemes");
    } finally {
      if (isMountedRef.current) {
        setProductLoading(false);
      }
    }
  }, [fetchData]);

  // ------------------- REFRESH HANDLER -------------------
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchSchemes(), fetchProductData()]);
    if (isMountedRef.current) {
      setRefreshing(false);
    }
  }, [fetchSchemes, fetchProductData]);

  // ------------------- INITIAL FETCH -------------------
  useEffect(() => {
    fetchSchemes();
  }, [fetchSchemes]);

  useFocusEffect(
    useCallback(() => {
      fetchProductData();
    }, [fetchProductData])
  );

  // ------------------- HANDLERS -------------------
  const handleOtpVerified = useCallback(() => {
    fetchProductData();
  }, [fetchProductData]);

  const handleNavigateToSchemes = useCallback(() => {
    navigation.navigate("MyScheme");
  }, [navigation]);

  const handleNavigateToGoldPlans = useCallback(() => {
    navigation.navigate("GoldPlanScreen");
  }, [navigation]);

  // ------------------- MEMOIZED RENDER ITEMS -------------------
  const renderProductCard = useCallback(
    (item) => (
      <ProductCard
        productData={item}
        loading={false}
        status={item.status}
        navigation={navigation}
        accountDetails={item.accountDetails}
      />
    ),
    [navigation]
  );

  const renderGoldPlan = useCallback(
    (scheme) => (
      <GoldPlan
        schemeId={scheme.schemeId}
        schemeName={scheme.schemeName}
        description={scheme.description}
        styles={styles.itemCardContainer}
      />
    ),
    []
  );

  const renderProductSkeleton = useCallback(
    (index) => <ProductCardSkeleton key={`product-skeleton-${index}`} />,
    []
  );

  const renderGoldPlanSkeleton = useCallback(
    (index) => <GoldPlansSkeleton key={`gold-skeleton-${index}`} />,
    []
  );

  // ------------------- HEADER CONTENT -------------------
  const headerContent = useMemo(
    () => (
      <>
        <MainHeader style={styles.header} />
        <Slider />

        <InfoCard
          title="Welcome to the Digital home of AKJ Mini Gold Souk"
          description="The ideal place to join a savings scheme and save up to buy your dream jewels. AKJ Mini Gold Souk empowers you to save and buy jewels conveniently in the palm of your hand. Start saving in gold from today."
        />

        {/* Your Schemes */}
        <View style={styles.titleSpacer}>
          <SectionHeader
            title="Your Schemes"
            onViewAll={handleNavigateToSchemes}
          />

          <SwipeableCards
            data={productData}
            loading={productLoading}
            error={productError}
            emptyMessage="No schemes available for your account"
            renderItem={renderProductCard}
            renderSkeleton={renderProductSkeleton}
            cardWidth={CARD_WIDTHS.product}
            style={styles.cardWrapper}
          />
        </View>

        <InfoCard
          title="Customized Gold Plans for You"
          description="Choose from a range of Gold Plans with unique benefits to suit your needs and convenience."
        />

        {/* Gold Plans */}
        <View style={styles.titleSpacer}>
          <SectionHeader
            title="Gold Plans"
            onViewAll={handleNavigateToGoldPlans}
          />

          <SwipeableCards
            data={schemes}
            loading={schemesLoading}
            error={schemesError}
            emptyMessage="No Gold Plans available at the moment"
            renderItem={renderGoldPlan}
            renderSkeleton={renderGoldPlanSkeleton}
            cardWidth={CARD_WIDTHS.goldPlan}
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
      productLoading,
      productError,
      productData,
      schemes,
      schemesLoading,
      schemesError,
      handleNavigateToSchemes,
      handleNavigateToGoldPlans,
      renderProductCard,
      renderProductSkeleton,
      renderGoldPlan,
      renderGoldPlanSkeleton,
    ]
  );

  return (
    <View style={styles.flex}>
      <ImageBackground
        source={require("../../assets/bg7.jpg")}
        style={styles.mainBackground}
        imageStyle={styles.backgroundImageStyle}
      >
        <FlatList
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={headerContent}
          data={[]}
          renderItem={null}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors1.primary}
              colors={[colors1.primary]}
              progressBackgroundColor={colors1.surface}
            />
          }
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