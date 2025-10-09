import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  Linking,
} from 'react-native';
import { COLORS } from '../../utils/Theme';

const { width } = Dimensions.get('window');

// Colors
const colors = {
  primary: '#CD865C',
  primaryLight: '#E8B79D',
  background: '#FFF9F6',
  shadow: 'rgba(179, 95, 52, 0.3)',
  cardBackground: '#FFFFFF',
};

// Skeleton Card with shimmer effect
const SkeletonCard = () => {
  const shimmer = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={styles.sliderItem1}>
      <View style={styles.imageContainer}>
        <Animated.View
          style={[
            styles.skeletonOverlay,
            { transform: [{ translateX }] },
          ]}
        />
      </View>
    </View>
  );
};

export default function EnhancedSlider() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const flatListRef = useRef(null);
  const intervalRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const FALLBACK_BANNERS = [
    { id: 1, image_path: '../../assets/image/slider3.jpg', url: 'https://bmgjewellers.com/shop-left?itemName=EARRINGS' },
    { id: 2, image_path: '../../assets/image/slider2.jpg', url: 'https://bmgjewellers.com/shop-left?itemName=NECKLACES' },
    { id: 3, image_path: '../../assets/image/slider1.jpg', url: 'https://bmgjewellers.com/shop-left?itemName=FESTIVAL' },
    { id: 4, image_path: '../../assets/image/slider1.jpg', url: 'https://bmgjewellers.com/shop-left?itemName=FESTIVAL' },
  ];

  // Fetch banners
useEffect(() => {
  let isMounted = true; // prevent state updates if component unmounted

  const fetchBanners = async () => {
    try {
      const response = await fetch('https://app.bmgjewellers.com/api/v1/App_banner/list');
      const data = await response.json();
      // console.log('Fetched banners:', data);
      if (!isMounted) return;

      const bannersWithUrls = data.map((banner, index) => {
        const fallbackBanner = FALLBACK_BANNERS[index] || FALLBACK_BANNERS[0];
        return { ...banner, url: fallbackBanner.url, image_path: banner.image_path };
      });
      setBanners(bannersWithUrls);
    } catch (error) {
      if (!isMounted) return;
      setBanners(FALLBACK_BANNERS);
    } finally {
      if (!isMounted) return;
      setLoading(false); // stop skeleton
    }
  };

  fetchBanners();

  return () => {
    isMounted = false;
  };
}, []);


  // Auto-scroll logic
  useEffect(() => {
    if (!banners.length) return;
    startAutoScroll();
    return () => stopAutoScroll();
  }, [banners, currentIndex, isAutoScrolling]);

  const startAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (isAutoScrolling && banners.length > 0) {
        const nextIndex = currentIndex === banners.length - 1 ? 0 : currentIndex + 1;
        scrollToIndex(nextIndex);
      }
    }, 4000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const scrollToIndex = (index) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  };

  const onScrollEnd = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (newIndex !== currentIndex) setCurrentIndex(newIndex);
  };

  const handleBannerPress = (url) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const renderSliderItem = ({ item }) => {
    const imageUrl = `https://app.bmgjewellers.com${item.image_path}`;
    return (
      <TouchableOpacity
        style={styles.sliderItem}
        activeOpacity={0.9}
        onPress={() => handleBannerPress(item.url)}
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.sliderImage}
            source={{ uri: imageUrl }}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderPaginationDots = () => (
    <View style={styles.paginationContainer}>
      {banners.map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  // Show skeleton loader if still loading
  if (loading) {
    return (
      <FlatList
        data={[1, 2, 3]}
        keyExtractor={(item) => item.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={() => <SkeletonCard />}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={banners}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderSliderItem}
        keyExtractor={(item) => item.id.toString()}
        snapToInterval={width}
        snapToAlignment="center"
        decelerationRate="fast"
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={onScrollEnd}
        onScrollBeginDrag={() => {
          setIsAutoScrolling(false);
          stopAutoScroll();
        }}
        onScrollEndDrag={() => {
          setTimeout(() => {
            setIsAutoScrolling(true);
            startAutoScroll();
          }, 3000);
        }}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
      {banners.length > 1 && renderPaginationDots()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: colors.background,
    marginVertical: 10,
    position: 'relative',
  },
  sliderItem: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  sliderItem1: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingRight: 30,
  },
  imageContainer: {
    width: '95%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: COLORS.textLight,
  },
  sliderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
  },
  skeletonOverlay: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    opacity: 0.6,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryLight,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 16,
    borderRadius: 8,
  },
});
